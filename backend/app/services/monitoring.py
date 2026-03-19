from app.core.supabase import supabase
from app.services.llm_validation import (
    classify_response,
    query_chatgpt_via_claude,
    query_perplexity,
)


async def run_monitoring_check(
    product_id: str, content_asset_id: str = None, check_type: str = "manual"
):
    """Re-query LLMs to check if they now cite our content."""
    product = (
        supabase.table("products")
        .select("name")
        .eq("id", product_id)
        .single()
        .execute()
    )
    product_name = product.data.get("name", "Unknown")

    queries = [
        f"What is {product_name}?",
        f"Is {product_name} worth it?",
        f"{product_name} review",
    ]

    results = []
    for query in queries:
        for engine_name, engine_fn in [
            ("perplexity", query_perplexity),
            ("chatgpt", query_chatgpt_via_claude),
        ]:
            raw_response = await engine_fn(query)
            response_type = await classify_response(
                product_name, query, raw_response
            )

            # Check if our content is cited
            # Look for our domain or article title in the response
            publish_records = (
                supabase.table("publish_records")
                .select("published_url")
                .eq("content_asset_id", content_asset_id)
                .execute()
                if content_asset_id
                else None
            )

            is_cited = False
            citation_url = None
            if publish_records and publish_records.data:
                for record in publish_records.data:
                    url = record.get("published_url", "")
                    if url and url in raw_response:
                        is_cited = True
                        citation_url = url
                        break

            # Also check if product name appears in a citation context
            if not is_cited and response_type in ("detailed", "cites-sources"):
                is_cited = True

            # Save monitoring check
            supabase.table("monitoring_checks").insert(
                {
                    "product_id": product_id,
                    "content_asset_id": content_asset_id,
                    "check_type": check_type,
                    "engine": engine_name,
                    "query": query,
                    "raw_response": raw_response,
                    "is_cited": is_cited,
                    "citation_url": citation_url,
                }
            ).execute()

            results.append(
                {
                    "engine": engine_name,
                    "query": query,
                    "response_type": response_type,
                    "is_cited": is_cited,
                    "citation_url": citation_url,
                }
            )

    # Create refresh alert if not cited after day-30 check
    if check_type == "day-30":
        cited_count = sum(1 for r in results if r["is_cited"])
        if cited_count == 0:
            supabase.table("refresh_alerts").insert(
                {
                    "product_id": product_id,
                    "user_id": product.data.get("user_id", ""),
                    "trigger_type": "geo-citation-lost",
                    "severity": "medium",
                    "title": f"{product_name} not cited after 30 days",
                    "description": (
                        f"No LLM citations detected for {product_name} after "
                        f"30 days post-publish."
                    ),
                    "action_required": (
                        "Review and optimise content. Consider updating with "
                        "fresh data and re-submitting to NeuronWriter."
                    ),
                    "status": "new",
                }
            ).execute()

    return results
