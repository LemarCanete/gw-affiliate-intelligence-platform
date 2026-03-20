from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    supabase_url: str
    supabase_service_key: str
    anthropic_api_key: str = ""
    perplexity_api_key: str = ""
    producthunt_token: str = ""
    producthunt_api_key: str = ""
    producthunt_api_secret: str = ""
    serpapi_key: str = ""
    openrouter_api_key: str = ""

    class Config:
        env_file = ".env"


settings = Settings()
