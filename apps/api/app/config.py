from functools import cached_property
from typing import Literal

from pydantic import Field, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
  model_config = SettingsConfigDict(env_file=".env", extra="ignore")

  database_url: str = "postgresql+psycopg://postgres:postgres@localhost:5432/calmdental"
  backend_cors_origins: str = "http://localhost:3000"
  ai_plan_mode: Literal["rule_based", "ai"] = "rule_based"
  ai_provider: str = "openai"
  openai_api_key: str = ""
  openai_model: str = "gpt-4.1-mini"
  ai_request_timeout_seconds: int = Field(default=20, gt=0)
  plan_retention_days: int = Field(default=7, gt=0)
  store_optional_free_text: bool = False
  enable_analytics: bool = False
  environment: str = "development"

  @model_validator(mode="after")
  def validate_settings(self) -> "Settings":
    if self.ai_plan_mode == "ai" and self.ai_provider != "openai":
      raise ValueError("AI_PROVIDER must be openai when AI_PLAN_MODE=ai")

    if (
      self.environment != "development"
      and "*" in self.cors_origins
    ):
      raise ValueError("Wildcard CORS origins are not allowed outside development")

    return self

  @cached_property
  def cors_origins(self) -> list[str]:
    return [
      origin.strip()
      for origin in self.backend_cors_origins.split(",")
      if origin.strip()
    ]


settings = Settings()
