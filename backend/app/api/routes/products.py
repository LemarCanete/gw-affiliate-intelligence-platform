from fastapi import APIRouter, HTTPException

from app.core.supabase import supabase
from app.models.schemas import ScoreInput
from app.services.scoring import score_product

router = APIRouter()


@router.get("/")
async def list_products(user_id: str, limit: int = 50, offset: int = 0):
    result = (
        supabase.table("products")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .range(offset, offset + limit - 1)
        .execute()
    )
    return {"data": result.data, "count": len(result.data)}


@router.get("/{product_id}")
async def get_product(product_id: str):
    result = (
        supabase.table("products")
        .select("*")
        .eq("id", product_id)
        .single()
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Product not found")
    return result.data


@router.post("/score")
async def score(input: ScoreInput):
    result = await score_product(
        input.product_id,
        input.product_newness,
        input.llm_gap_strength,
        input.buying_intent,
        input.affiliate_available,
        input.google_gap_strength,
        input.notes,
    )
    return result
