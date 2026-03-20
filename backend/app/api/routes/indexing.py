from fastapi import APIRouter
from pydantic import BaseModel

from app.services.indexing import check_batch_indexing, request_indexing

router = APIRouter()


class IndexCheckRequest(BaseModel):
    url: str


class BatchIndexCheckRequest(BaseModel):
    urls: list[str]


@router.post("/check")
async def check_index(request: IndexCheckRequest):
    return await request_indexing(request.url)


@router.post("/batch")
async def batch_check(request: BatchIndexCheckRequest):
    results = await check_batch_indexing(request.urls)
    return {"results": results}
