from __future__ import annotations

import pytest
from pydantic import ValidationError

from app.config import Settings


def test_config_accepts_rule_based_defaults() -> None:
  settings = Settings()

  assert settings.ai_plan_mode == "rule_based"
  assert settings.cors_origins == ["http://localhost:3000"]


def test_config_rejects_invalid_ai_plan_mode() -> None:
  with pytest.raises(ValidationError):
    Settings(ai_plan_mode="sometimes")


def test_config_rejects_invalid_ai_provider_in_ai_mode() -> None:
  with pytest.raises(ValidationError, match="AI_PROVIDER must be openai"):
    Settings(ai_plan_mode="ai", ai_provider="anthropic")


@pytest.mark.parametrize(
  "field_name",
  ["plan_retention_days", "ai_request_timeout_seconds"],
)
def test_config_rejects_non_positive_numeric_settings(field_name: str) -> None:
  with pytest.raises(ValidationError):
    Settings(**{field_name: 0})


def test_config_rejects_wildcard_cors_outside_development() -> None:
  with pytest.raises(ValidationError, match="Wildcard CORS"):
    Settings(environment="production", backend_cors_origins="*")


def test_config_allows_missing_openai_key_in_ai_mode() -> None:
  settings = Settings(ai_plan_mode="ai", openai_api_key="")

  assert settings.ai_plan_mode == "ai"
  assert settings.openai_api_key == ""
