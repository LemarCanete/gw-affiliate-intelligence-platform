from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.wordpress import publish_to_wordpress, test_wp_connection

router = APIRouter()


class WpTestRequest(BaseModel):
    site_url: str
    username: str
    app_password: str


class WpPublishRequest(BaseModel):
    user_id: str
    content_asset_id: str


@router.post("/test")
async def test_connection(request: WpTestRequest):
    result = await test_wp_connection(
        request.site_url, request.username, request.app_password
    )
    return result


@router.post("/publish")
async def publish(request: WpPublishRequest):
    result = await publish_to_wordpress(request.user_id, request.content_asset_id)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result
