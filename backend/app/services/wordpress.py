import httpx
from app.core.supabase import supabase


async def test_wp_connection(site_url: str, username: str, app_password: str) -> dict:
    """Test WordPress connection and verify RankMath is installed."""
    async with httpx.AsyncClient() as client:
        # Test auth
        auth = (username, app_password)
        response = await client.get(
            f"{site_url}/wp-json/wp/v2/posts?per_page=1",
            auth=auth,
            timeout=15.0,
        )

        if response.status_code != 200:
            return {"connected": False, "error": f"Auth failed: {response.status_code}"}

        # Detect SEO plugin — RankMath is REQUIRED
        plugins_response = await client.get(
            f"{site_url}/wp-json/wp/v2/plugins", auth=auth, timeout=15.0
        )

        rankmath_found = False
        if plugins_response.status_code == 200:
            plugins = plugins_response.json()
            for plugin in plugins:
                slug = plugin.get("plugin", "")
                if "seo-by-rank-math" in slug:
                    rankmath_found = True
                    break

        if not rankmath_found:
            return {
                "connected": False,
                "error": "RankMath SEO plugin must be installed and active on your WordPress site. This platform requires RankMath — Yoast and other SEO plugins are not supported.",
                "seo_plugin": None,
            }

        return {"connected": True, "seo_plugin": "rankmath"}


async def publish_to_wordpress(user_id: str, content_asset_id: str) -> dict:
    """Publish a content asset to WordPress with full RankMath meta fields."""
    # Get user's WP settings
    settings = (
        supabase.table("user_settings")
        .select("*")
        .eq("user_id", user_id)
        .single()
        .execute()
    )
    if not settings.data or not settings.data.get("wp_connected"):
        return {"error": "WordPress not connected"}

    if settings.data.get("wp_seo_plugin") != "rankmath":
        return {"error": "RankMath is required. Please reconnect your WordPress site with RankMath installed."}

    site_url = settings.data["wp_site_url"]
    username = settings.data["wp_username"]
    app_password = settings.data["wp_app_password"]

    # Get content asset
    asset = (
        supabase.table("content_assets")
        .select("*")
        .eq("id", content_asset_id)
        .single()
        .execute()
    )
    if not asset.data:
        return {"error": "Content asset not found"}

    auth = (username, app_password)
    post_status = settings.data.get("default_post_status", "draft")

    # Get keyword from the content brief or asset title
    primary_keyword = asset.data.get("title", "").split(":")[0].strip()
    slug = primary_keyword.lower().replace(" ", "-").replace("'", "").replace('"', "")

    # Build meta
    meta_title = asset.data.get("title", "")[:60]
    meta_description = (asset.data.get("body", "")[:155]).strip()

    # Build WordPress post with RankMath meta
    post_data = {
        "title": asset.data["title"],
        "content": asset.data.get("body", ""),
        "status": post_status,
        "slug": slug,
        "excerpt": meta_description,
        "meta": {
            "rank_math_title": meta_title,
            "rank_math_description": meta_description,
            "rank_math_focus_keyword": primary_keyword,
            "rank_math_robots": "index,follow",
            "rank_math_canonical_url": "",  # Will be set to published URL after publish
        },
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{site_url}/wp-json/wp/v2/posts",
            auth=auth,
            json=post_data,
            timeout=30.0,
        )

        if response.status_code not in (200, 201):
            return {
                "error": f"WordPress publish failed: {response.status_code}",
                "details": response.text[:500],
            }

        wp_post = response.json()
        published_url = wp_post.get("link", "")
        wp_post_id = wp_post.get("id")

        # Update canonical URL to the published URL
        await client.post(
            f"{site_url}/wp-json/wp/v2/posts/{wp_post_id}",
            auth=auth,
            json={"meta": {"rank_math_canonical_url": published_url}},
            timeout=15.0,
        )

    # Save publish record
    supabase.table("publish_records").insert(
        {
            "content_asset_id": content_asset_id,
            "user_id": user_id,
            "wordpress_post_id": wp_post_id,
            "published_url": published_url,
            "post_status": post_status,
            "meta_title": meta_title,
            "meta_description": meta_description,
            "focus_keyword": primary_keyword,
            "slug": slug,
            "seo_plugin": "rankmath",
            "schemas_applied": ["FAQPage", "Person", "BreadcrumbList"],
            "word_count": asset.data.get("word_count"),
            "faq_count": asset.data.get("faq_count", 0),
            "published_at": None if post_status == "draft" else "now()",
        }
    ).execute()

    # Update content asset status
    supabase.table("content_assets").update(
        {
            "status": "published" if post_status == "publish" else "scheduled",
            "url": published_url,
        }
    ).eq("id", content_asset_id).execute()

    return {
        "wordpress_post_id": wp_post_id,
        "published_url": published_url,
        "status": post_status,
        "seo_plugin": "rankmath",
    }
