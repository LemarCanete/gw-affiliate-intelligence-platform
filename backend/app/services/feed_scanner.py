from datetime import datetime

import feedparser
import httpx

from app.core.config import settings
from app.core.supabase import supabase

PRODUCTHUNT_GRAPHQL = "https://api.producthunt.com/v2/api/graphql"
PRODUCTHUNT_OAUTH_TOKEN = "https://api.producthunt.com/v2/oauth/token"

_cached_token: str | None = None


async def get_producthunt_token() -> str | None:
    """Get Product Hunt access token — use existing token or exchange API key/secret."""
    global _cached_token

    if settings.producthunt_token:
        return settings.producthunt_token

    if _cached_token:
        return _cached_token

    if not settings.producthunt_api_key or not settings.producthunt_api_secret:
        return None

    async with httpx.AsyncClient() as client:
        response = await client.post(
            PRODUCTHUNT_OAUTH_TOKEN,
            json={
                "client_id": settings.producthunt_api_key,
                "client_secret": settings.producthunt_api_secret,
                "grant_type": "client_credentials",
            },
            timeout=15.0,
        )

    if response.status_code != 200:
        print(f"Product Hunt token exchange failed: {response.status_code} {response.text}")
        return None

    data = response.json()
    _cached_token = data.get("access_token")
    return _cached_token

PRODUCTHUNT_QUERY = """
query {
  posts(order: NEWEST, first: 20, topic: "artificial-intelligence") {
    edges {
      node {
        id
        name
        tagline
        url
        website
        createdAt
        votesCount
        topics {
          edges {
            node {
              name
            }
          }
        }
      }
    }
  }
}
"""


async def scan_producthunt(user_id: str) -> list[dict]:
    """Scan Product Hunt for new AI/SaaS product launches."""
    token = await get_producthunt_token()
    if not token:
        return []

    async with httpx.AsyncClient() as client:
        response = await client.post(
            PRODUCTHUNT_GRAPHQL,
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json",
            },
            json={"query": PRODUCTHUNT_QUERY},
            timeout=30.0,
        )

    data = response.json()
    posts = data.get("data", {}).get("posts", {}).get("edges", [])

    discovered = []
    for edge in posts:
        node = edge["node"]

        # Check if already exists
        existing = (
            supabase.table("products")
            .select("id")
            .eq("name", node["name"])
            .eq("user_id", user_id)
            .execute()
        )
        if existing.data:
            continue

        # Insert new product
        result = (
            supabase.table("products")
            .insert(
                {
                    "user_id": user_id,
                    "name": node["name"],
                    "description": node["tagline"],
                    "product_url": node["website"] or node["url"],
                    "category": "AI/SaaS",
                    "source": "serp-gap",
                    "status": "draft",
                    "launched_at": node["createdAt"],
                }
            )
            .execute()
        )

        if result.data:
            discovered.append(result.data[0])

    # Update feed stats
    supabase.table("feeds").upsert(
        {
            "user_id": user_id,
            "type": "serp-gap",
            "name": "SERP Gap Scanner",
            "health": "healthy",
            "items_discovered": len(discovered),
            "last_run": datetime.utcnow().isoformat(),
        },
        on_conflict="user_id,type",
    ).execute()

    return discovered


async def scan_appsump_rss(user_id: str) -> list[dict]:
    """Scan AppSumo deals via RSS feed."""
    feed = feedparser.parse("https://appsumo.com/tools/feed/")

    discovered = []
    for entry in feed.entries[:20]:
        name = entry.get("title", "").strip()
        if not name:
            continue

        existing = (
            supabase.table("products")
            .select("id")
            .eq("name", name)
            .eq("user_id", user_id)
            .execute()
        )
        if existing.data:
            continue

        result = (
            supabase.table("products")
            .insert(
                {
                    "user_id": user_id,
                    "name": name,
                    "description": entry.get("summary", "")[:500],
                    "product_url": entry.get("link", ""),
                    "category": "AI/SaaS",
                    "source": "serp-gap",
                    "status": "draft",
                    "launched_at": entry.get(
                        "published", datetime.utcnow().isoformat()
                    ),
                }
            )
            .execute()
        )

        if result.data:
            discovered.append(result.data[0])

    return discovered
