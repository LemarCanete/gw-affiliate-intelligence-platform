from fastapi import APIRouter

from app.models.schemas import LlmTestRequest
from app.services.llm_validation import run_gap_validation

router = APIRouter()


@router.post("/validate")
async def validate_gap(request: LlmTestRequest):
    results = await run_gap_validation(
        request.product_id, request.engines, request.query
    )
    return {"results": results}
