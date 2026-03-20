import httpx
from app.core.config import settings
from app.core.supabase import supabase

SERPAPI_URL = "https://serpapi.com/search"


async def check_google_gap(product_name: str, query: str = None) -> dict:
    """Check Google for existing content about a product. Returns gap assessment."""
    if not settings.serpapi_key:
        return {"error": "SerpAPI key not configured", "gap_score": 0}

    search_query = query or f"{product_name} review"

    async with httpx.AsyncClient() as client:
        response = await client.get(
            SERPAPI_URL,
            params={
                "q": search_query,
                "api_key": settings.serpapi_key,
                "engine": "google",
                "num": 10,
            },
            timeout=30.0,
        )

    if response.status_code != 200:
        return {"error": f"SerpAPI request failed: {response.status_code}", "gap_score": 0}

    data = response.json()
    organic = data.get("organic_results", [])
    total_results = data.get("search_information", {}).get("total_results", 0)

    # Analyze results quality
    quality_signals = {
        "total_organic": len(organic),
        "total_results": total_results,
        "has_reviews": False,
        "has_forums_only": True,
        "high_da_thin": 0,
        "direct_reviews": 0,
    }

    review_keywords = ["review", "worth it", "pros and cons", "honest", "tested"]
    forum_domains = ["reddit.com", "quora.com", "forum", "community"]
    high_da_domains = ["g2.com", "capterra.com", "trustpilot.com", "producthunt.com",
                       "techcrunch.com", "forbes.com", "wikipedia.org"]

    for result in organic:
        title = (result.get("title") or "").lower()
        link = (result.get("link") or "").lower()
        snippet = (result.get("snippet") or "").lower()

        # Check if it's a real review
        if any(kw in title or kw in snippet for kw in review_keywords):
            quality_signals["direct_reviews"] += 1
            quality_signals["has_reviews"] = True

        # Check if forums dominate
        if not any(fd in link for fd in forum_domains):
            quality_signals["has_forums_only"] = False

        # Check for high DA thin content
        if any(hd in link for hd in high_da_domains):
            quality_signals["high_da_thin"] += 1

    # Calculate gap score (1 = saturated, 5 = wide open)
    direct_reviews = quality_signals["direct_reviews"]
    if direct_reviews == 0:
        gap_score = 5  # Wide open — no reviews at all
        gap_quality = "none"
    elif direct_reviews <= 2 and quality_signals["has_forums_only"]:
        gap_score = 4  # Only forums ranking — big opportunity
        gap_quality = "thin"
    elif direct_reviews <= 2:
        gap_score = 3  # Thin content from high DA sites
        gap_quality = "thin"
    elif direct_reviews <= 5:
        gap_score = 2  # Some competition
        gap_quality = "moderate"
    else:
        gap_score = 1  # Saturated
        gap_quality = "saturated"

    # Determine pass/fail for the google_gap_strength factor
    google_gap_pass = 1 if gap_score >= 3 else 0

    return {
        "query": search_query,
        "gap_score": gap_score,
        "gap_quality": gap_quality,
        "google_gap_pass": google_gap_pass,
        "total_results": total_results,
        "organic_count": len(organic),
        "direct_reviews": direct_reviews,
        "forums_dominate": quality_signals["has_forums_only"],
        "high_da_thin": quality_signals["high_da_thin"],
        "top_results": [
            {
                "title": r.get("title", ""),
                "link": r.get("link", ""),
                "snippet": (r.get("snippet") or "")[:150],
                "position": r.get("position", 0),
            }
            for r in organic[:5]
        ],
    }


async def check_youtube_gap(product_name: str) -> dict:
    """Check YouTube for existing content about a product."""
    if not settings.serpapi_key:
        return {"error": "SerpAPI key not configured", "gap_score": 0}

    search_query = f"{product_name} review"

    async with httpx.AsyncClient() as client:
        response = await client.get(
            SERPAPI_URL,
            params={
                "q": search_query,
                "api_key": settings.serpapi_key,
                "engine": "youtube",
                "num": 10,
            },
            timeout=30.0,
        )

    if response.status_code != 200:
        return {"error": f"SerpAPI request failed: {response.status_code}", "results": 0}

    data = response.json()
    video_results = data.get("video_results", [])

    return {
        "query": search_query,
        "results_count": len(video_results),
        "videos": [
            {
                "title": v.get("title", ""),
                "link": v.get("link", ""),
                "channel": v.get("channel", {}).get("name", ""),
                "views": v.get("views", 0),
            }
            for v in video_results[:5]
        ],
    }


async def auto_score_product(product_id: str) -> dict:
    """Run full gap check on a product: Google + YouTube + derive google_gap_strength score."""
    product = supabase.table("products").select("name").eq("id", product_id).single().execute()
    if not product.data:
        return {"error": "Product not found"}

    product_name = product.data["name"]

    google_result = await check_google_gap(product_name)
    youtube_result = await check_youtube_gap(product_name)

    # Store the SERP check as a note in product_scores if score exists
    google_gap_pass = google_result.get("google_gap_pass", 0)

    return {
        "product_id": product_id,
        "product_name": product_name,
        "google": google_result,
        "youtube": youtube_result,
        "google_gap_pass": google_gap_pass,
        "recommendation": "Gap confirmed — worth pursuing" if google_gap_pass == 1 else "Gap closing or saturated — investigate manually",
    }
