from fastapi import APIRouter

from app.models.schemas import MonitoringRequest
from app.services.monitoring import run_monitoring_check

router = APIRouter()


@router.post("/check")
async def check_citations(request: MonitoringRequest):
    results = await run_monitoring_check(
        request.product_id, request.content_asset_id, request.check_type
    )
    return {"results": results}
