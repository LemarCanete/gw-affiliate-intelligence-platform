from pydantic import BaseModel
from typing import Optional, List
from enum import Enum


class GapVerdict(str, Enum):
    auto_queue = "auto-queue"
    human_review = "human-review"
    discard = "discard"


class ScoreInput(BaseModel):
    product_id: str
    product_newness: int  # 0 or 1
    llm_gap_strength: int
    buying_intent: int
    affiliate_available: int
    google_gap_strength: int
    notes: Optional[str] = None


class LlmTestRequest(BaseModel):
    product_id: str
    engines: List[str]  # ["chatgpt", "perplexity"]
    query: str


class LlmTestResult(BaseModel):
    engine: str
    query: str
    response_type: str  # no-info, vague, generic, detailed, cites-sources
    raw_response: str
    cited_sources: List[str] = []


class MonitoringRequest(BaseModel):
    product_id: str
    content_asset_id: Optional[str] = None
    check_type: str = "manual"  # day-7, day-30, manual


class FeedScanRequest(BaseModel):
    feed_type: str  # serp-gap, reddit-miner, etc.
    user_id: str
