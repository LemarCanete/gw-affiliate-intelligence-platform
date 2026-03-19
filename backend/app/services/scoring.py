from app.core.supabase import supabase


def derive_verdict(total: int) -> str:
    if total >= 4:
        return "auto-queue"
    if total == 3:
        return "human-review"
    return "discard"


def derive_gap_status(llm_gap: int, google_gap: int) -> str:
    if llm_gap == 1 and google_gap == 1:
        return "double-gap"
    if google_gap == 1:
        return "google-only"
    if llm_gap == 1:
        return "llm-only"
    return "closing"


async def score_product(
    product_id: str,
    product_newness: int,
    llm_gap_strength: int,
    buying_intent: int,
    affiliate_available: int,
    google_gap_strength: int,
    notes: str = None,
):
    total = (
        product_newness
        + llm_gap_strength
        + buying_intent
        + affiliate_available
        + google_gap_strength
    )
    verdict = derive_verdict(total)
    gap_status = derive_gap_status(llm_gap_strength, google_gap_strength)

    # Upsert score
    supabase.table("product_scores").upsert(
        {
            "product_id": product_id,
            "product_newness": product_newness,
            "llm_gap_strength": llm_gap_strength,
            "buying_intent": buying_intent,
            "affiliate_available": affiliate_available,
            "google_gap_strength": google_gap_strength,
            "notes": notes,
        },
        on_conflict="product_id",
    ).execute()

    # Update product
    supabase.table("products").update(
        {
            "verdict": verdict,
            "gap_status": gap_status,
        }
    ).eq("id", product_id).execute()

    return {"total": total, "verdict": verdict, "gap_status": gap_status}
