from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from app.services.serp_checker import check_google_gap, check_youtube_gap, auto_score_product

router = APIRouter()


class SerpCheckRequest(BaseModel):
    product_name: str
    query: Optional[str] = None


class AutoScoreRequest(BaseModel):
    product_id: str


@router.post("/google")
async def google_gap(request: SerpCheckRequest):
    """Check Google for content gap on a product."""
    result = await check_google_gap(request.product_name, request.query)
    return result


@router.post("/youtube")
async def youtube_gap(request: SerpCheckRequest):
    """Check YouTube for content gap on a product."""
    result = await check_youtube_gap(request.product_name)
    return result


@router.post("/auto-score")
async def auto_score(request: AutoScoreRequest):
    """Run full SERP gap check and return scoring recommendation."""
    result = await auto_score_product(request.product_id)
    return result
