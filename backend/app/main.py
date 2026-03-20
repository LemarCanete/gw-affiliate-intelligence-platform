from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import (
    feeds,
    indexing,
    llm_validation,
    monitoring,
    products,
    schema,
    serp,
    validation,
    wordpress,
)

app = FastAPI(title="GW Intelligence API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router, prefix="/api/products", tags=["products"])
app.include_router(feeds.router, prefix="/api/feeds", tags=["feeds"])
app.include_router(
    llm_validation.router, prefix="/api/llm", tags=["llm-validation"]
)
app.include_router(monitoring.router, prefix="/api/monitoring", tags=["monitoring"])
app.include_router(wordpress.router, prefix="/api/wordpress", tags=["wordpress"])
app.include_router(validation.router, prefix="/api/validation", tags=["validation"])
app.include_router(schema.router, prefix="/api/schema", tags=["schema"])
app.include_router(serp.router, prefix="/api/serp", tags=["serp"])
app.include_router(indexing.router, prefix="/api/indexing", tags=["indexing"])


@app.get("/health")
async def health():
    return {"status": "ok"}
