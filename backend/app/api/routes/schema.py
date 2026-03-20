from typing import Optional

from fastapi import APIRouter
from pydantic import BaseModel

from app.services.schema_generator import (
    generate_article_schema,
    generate_author_schema,
    generate_breadcrumb_schema,
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


class BreadcrumbRequest(BaseModel):
    items: list[dict]  # [{name: "Home", url: "https://..."}, {name: "Blog", url: "..."}, ...]


class ArticleSchemaRequest(BaseModel):
    headline: str
    author_name: str
    author_url: str
    published_url: str
    image_url: Optional[str] = ""
    keywords: Optional[str] = ""
    date_published: Optional[str] = ""
    date_modified: Optional[str] = ""
    publisher_name: Optional[str] = ""
    publisher_logo: Optional[str] = ""


@router.post("/review")
async def review_schema(request: ReviewSchemaRequest):
    schema = generate_review_schema(
        request.product_name, request.category, request.author_name,
        request.author_url, request.rating, request.review_body, request.published_url,
    )
    return {"schema": schema}


@router.post("/faq")
async def faq_schema(request: FaqSchemaRequest):
    schema = generate_faq_schema(request.faqs)
    return {"schema": schema}


@router.post("/author")
async def author_schema(request: AuthorSchemaRequest):
    schema = generate_author_schema(
        request.name, request.url, request.bio,
        request.job_title, request.linkedin, request.twitter,
    )
    return {"schema": schema}


@router.post("/breadcrumb")
async def breadcrumb_schema(request: BreadcrumbRequest):
    """Generate BreadcrumbList schema — required on ALL posts."""
    schema = generate_breadcrumb_schema(request.items)
    return {"schema": schema}


@router.post("/article")
async def article_schema(request: ArticleSchemaRequest):
    """Generate Article schema for Explainer, How-To, Comparison content types."""
    schema = generate_article_schema(
        request.headline, request.author_name, request.author_url,
        request.published_url, request.image_url, request.keywords,
        request.date_published, request.date_modified,
        request.publisher_name, request.publisher_logo,
    )
    return {"schema": schema}
