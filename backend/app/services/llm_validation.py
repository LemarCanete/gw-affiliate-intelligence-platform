import re

import httpx
from anthropic import Anthropic

from app.core.config import settings
from app.core.supabase import supabase

anthropic_client = (
    Anthropic(api_key=settings.anthropic_api_key) if settings.anthropic_api_key else None
)

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


async def query_perplexity(query: str) -> str:
    """Query Perplexity API and return raw response."""
    if not settings.perplexity_api_key:
        return "Perplexity API key not configured"

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.perplexity.ai/chat/completions",
            headers={
                "Authorization": f"Bearer {settings.perplexity_api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": "sonar",
                "messages": [{"role": "user", "content": query}],
                "temperature": 0.2,
                "max_tokens": 1000,
            },
            timeout=30.0,
        )
        data = response.json()
        return (
            data.get("choices", [{}])[0]
            .get("message", {})
            .get("content", "No response")
        )


async def query_chatgpt_via_claude(query: str) -> str:
    """Use Claude to simulate what ChatGPT would say (or use OpenAI API if available).
    For now, we query Claude and note this is a proxy."""
    if not anthropic_client:
        return "Anthropic API key not configured"

    message = anthropic_client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1000,
        messages=[{"role": "user", "content": query}],
    )
    return message.content[0].text


async def classify_response(product_name: str, query: str, response: str) -> str:
    """Use Claude to classify the LLM response."""
    if not anthropic_client:
        return "vague"

    prompt = CLASSIFICATION_PROMPT.format(
        product_name=product_name, query=query, response=response
    )

    message = anthropic_client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=50,
        messages=[{"role": "user", "content": prompt}],
    )

    classification = message.content[0].text.strip().lower()
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
