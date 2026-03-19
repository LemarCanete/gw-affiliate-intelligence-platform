import httpx
from app.core.supabase import supabase


async def test_wp_connection(site_url: str, username: str, app_password: str) -> dict:
    """Test WordPress connection and detect SEO plugin."""
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

        # Detect SEO plugin
        plugins_response = await client.get(
            f"{site_url}/wp-json/wp/v2/plugins", auth=auth, timeout=15.0
        )
        seo_plugin = None
        if plugins_response.status_code == 200:
            plugins = plugins_response.json()
            for plugin in plugins:
                slug = plugin.get("plugin", "")
                if "wordpress-seo" in slug:
                    seo_plugin = "yoast"
                    break
                elif "seo-by-rank-math" in slug:
                    seo_plugin = "rankmath"
                    break

        return {"connected": True, "seo_plugin": seo_plugin}


async def publish_to_wordpress(user_id: str, content_asset_id: str) -> dict:
    """Publish a content asset to WordPress. Returns publish record data."""
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

    site_url = settings.data["wp_site_url"]
    username = settings.data["wp_username"]
    app_password = settings.data["wp_app_password"]
    seo_plugin = settings.data.get("wp_seo_plugin")

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

    # Get product for keyword/affiliate info
    product = (
        supabase.table("products")
        .select("*")
        .eq("id", asset.data["product_id"])
        .single()
        .execute()
    )

    auth = (username, app_password)
    post_status = settings.data.get("default_post_status", "draft")

    # Build WordPress post
    product_name = product.data.get("name", "")
    primary_keyword = f"{product_name} review"
    slug = primary_keyword.lower().replace(" ", "-")
    meta_title = f"{product_name} Review (2026) | Honest Pros & Cons"[:60]
    meta_description = (
        f"Is {product_name} worth it? We tested it "
        f"— honest take on features, pricing, who it's best for."
    )[:155]

    post_data = {
        "title": asset.data["title"],
        "content": asset.data.get("body", ""),
        "status": post_status,
        "slug": slug,
        "excerpt": meta_description,
    }

    # Add SEO plugin meta
    if seo_plugin == "yoast":
        post_data["meta"] = {
            "_yoast_wpseo_title": meta_title,
            "_yoast_wpseo_metadesc": meta_description,
            "_yoast_wpseo_focuskw": primary_keyword,
        }
    elif seo_plugin == "rankmath":
        post_data["meta"] = {
            "rank_math_title": meta_title,
            "rank_math_description": meta_description,
            "rank_math_focus_keyword": primary_keyword,
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
            "seo_plugin": seo_plugin,
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
        "seo_plugin": seo_plugin,
    }
