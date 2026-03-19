from fastapi import APIRouter

from app.core.supabase import supabase
from app.models.schemas import FeedScanRequest
from app.services.feed_scanner import scan_appsump_rss, scan_producthunt

router = APIRouter()


@router.post("/scan/producthunt")
async def scan_ph(request: FeedScanRequest):
    results = await scan_producthunt(request.user_id)
    return {"discovered": len(results), "products": results}


@router.post("/scan/appsump")
async def scan_as(request: FeedScanRequest):
    results = await scan_appsump_rss(request.user_id)
    return {"discovered": len(results), "products": results}


@router.get("/status/{user_id}")
async def feed_status(user_id: str):
    result = supabase.table("feeds").select("*").eq("user_id", user_id).execute()
    return {"feeds": result.data}
