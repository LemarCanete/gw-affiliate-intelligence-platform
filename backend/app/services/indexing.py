import httpx

from app.core.config import settings
from app.core.supabase import supabase


async def request_indexing(url: str) -> dict:
    """Request Google to index a URL via the Indexing API.
    Note: Requires Google OAuth token — this is a placeholder that uses
    the URL Inspection approach via SerpAPI as a workaround."""

    # For now, we use SerpAPI to check if URL is indexed
    if not settings.serpapi_key:
        return {"status": "skipped", "reason": "SerpAPI key not configured"}

    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://serpapi.com/search",
            params={
                "q": f"site:{url}",
                "api_key": settings.serpapi_key,
                "engine": "google",
                "num": 1,
            },
            timeout=15.0,
        )

    if response.status_code != 200:
        return {"status": "error", "reason": f"SerpAPI error: {response.status_code}"}

    data = response.json()
    total = data.get("search_information", {}).get("total_results", 0)

    return {
        "url": url,
        "indexed": total > 0,
        "total_results": total,
        "status": "indexed" if total > 0 else "not_indexed",
    }


async def check_batch_indexing(urls: list[str]) -> list[dict]:
    """Check indexing status for multiple URLs."""
    results = []
    for url in urls:
        result = await request_indexing(url)
        results.append(result)
    return results
