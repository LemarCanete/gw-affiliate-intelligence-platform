from fastapi import APIRouter
from pydantic import BaseModel

from app.services.content_validation import validate_content

router = APIRouter()


class ValidateRequest(BaseModel):
    title: str
    body: str
    primary_keyword: str
    slug: str
    meta_title: str
    meta_description: str


@router.post("/check")
async def check_content(request: ValidateRequest):
    result = validate_content(
        request.title,
        request.body,
        request.primary_keyword,
        request.slug,
        request.meta_title,
        request.meta_description,
    )
    return result
