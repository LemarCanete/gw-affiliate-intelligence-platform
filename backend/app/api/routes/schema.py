from typing import Optional

from fastapi import APIRouter
from pydantic import BaseModel

from app.services.schema_generator import (
    generate_author_schema,
    generate_faq_schema,
    generate_review_schema,
)

router = APIRouter()


class ReviewSchemaRequest(BaseModel):
    product_name: str
    category: str
    author_name: str
    author_url: str
    rating: float
    review_body: str
    published_url: str


class FaqSchemaRequest(BaseModel):
    faqs: list[dict]


class AuthorSchemaRequest(BaseModel):
    name: str
    url: str
    bio: str
    job_title: Optional[str] = ""
    linkedin: Optional[str] = ""
    twitter: Optional[str] = ""


@router.post("/review")
async def review_schema(request: ReviewSchemaRequest):
    schema = generate_review_schema(
        request.product_name,
        request.category,
        request.author_name,
        request.author_url,
        request.rating,
        request.review_body,
        request.published_url,
    )
    return {"schema": schema}


@router.post("/faq")
async def faq_schema(request: FaqSchemaRequest):
    schema = generate_faq_schema(request.faqs)
    return {"schema": schema}


@router.post("/author")
async def author_schema(request: AuthorSchemaRequest):
    schema = generate_author_schema(
        request.name,
        request.url,
        request.bio,
        request.job_title,
        request.linkedin,
        request.twitter,
    )
    return {"schema": schema}
