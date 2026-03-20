import re

import httpx

from app.core.config import settings
from app.core.supabase import supabase

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

# Model fallback chain
MODELS = [
    "anthropic/claude-sonnet-4-20250514",
    "openai/gpt-4o",
    "google/gemini-2.0-flash-001",
]

CLASSIFICATION_PROMPT = """Analyze this LLM response about the product "{product_name}".
The query was: "{query}"
The LLM response was: "{response}"

Does this response give a clear, confident, specific answer about {product_name}?
Classify as exactly one of: no-info, vague, generic, detailed, cites-sources

Rules:
- no-info: LLM says it doesn't have information or can't find anything
- vague: LLM gives a generic non-specific answer, guesses, or hedges significantly
- generic: LLM has some info but it's surface-level, no specific details about features/pricing
- detailed: LLM gives a confident answer with specific details about the product
- cites-sources: LLM references specific review articles, websites, or sources by name

Respond with ONLY the classification word, nothing else."""


async def call_openrouter(messages: list[dict], model: str = None) -> str:
    """Call OpenRouter with fallback models."""
    if not settings.openrouter_api_key:
        return "OpenRouter API key not configured"

    models_to_try = [model] if model else MODELS

    for m in models_to_try:
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    OPENROUTER_URL,
                    headers={
                        "Authorization": f"Bearer {settings.openrouter_api_key}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": m,
                        "messages": messages,
                        "max_tokens": 1000,
                        "temperature": 0.2,
                    },
                    timeout=30.0,
                )
                if response.status_code == 200:
                    data = response.json()
                    return data["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"OpenRouter {m} failed: {e}")
            continue

    return "All models failed"


async def query_perplexity(query: str) -> str:
    """Query Perplexity via OpenRouter."""
    return await call_openrouter(
        [{"role": "user", "content": query}],
        model="perplexity/sonar",
    )


async def query_chatgpt_via_claude(query: str) -> str:
    """Query LLM via OpenRouter with multi-model fallback."""
    return await call_openrouter(
        [{"role": "user", "content": query}],
    )


async def classify_response(product_name: str, query: str, response: str) -> str:
    """Use OpenRouter (Claude preferred) to classify the LLM response."""
    prompt = CLASSIFICATION_PROMPT.format(
        product_name=product_name, query=query, response=response
    )

    result = await call_openrouter(
        [{"role": "user", "content": prompt}],
        model="anthropic/claude-sonnet-4-20250514",
    )

    classification = result.strip().lower()
    valid = ["no-info", "vague", "generic", "detailed", "cites-sources"]
    return classification if classification in valid else "vague"


async def run_gap_validation(product_id: str, engines: list[str], query: str):
    """Run LLM gap validation for a product across specified engines."""
    # Get product name
    product = (
        supabase.table("products")
        .select("name")
        .eq("id", product_id)
        .single()
        .execute()
    )
    product_name = product.data.get("name", "Unknown")

    results = []

    for engine in engines:
        # Query the LLM
        if engine == "perplexity":
            raw_response = await query_perplexity(query)
        elif engine == "chatgpt":
            raw_response = await query_chatgpt_via_claude(query)
        else:
            continue

        # Classify the response
        response_type = await classify_response(product_name, query, raw_response)

        # Extract cited sources (simple pattern matching)
        cited_sources = []
        if response_type == "cites-sources":
            # Look for URLs or source names in the response
            urls = re.findall(r'https?://[^\s<>"{}|\\^`\[\]]+', raw_response)
            cited_sources = urls[:10]

        # Save to database
        supabase.table("llm_test_results").insert(
            {
                "product_id": product_id,
                "engine": engine,
                "query": query,
                "raw_response": raw_response,
                "response_type": response_type,
                "cited_sources": cited_sources,
            }
        ).execute()

        results.append(
            {
                "engine": engine,
                "query": query,
                "response_type": response_type,
                "raw_response": raw_response[:500],  # Truncate for API response
                "cited_sources": cited_sources,
            }
        )

    return results
