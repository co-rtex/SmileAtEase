from __future__ import annotations

import json
from typing import Any

from pydantic import ValidationError

from app.config import settings
from app.schemas.assessment import IntakeSchema
from app.schemas.plan import PlanSchema, SafetyStatus as PlanSafetyStatus
from app.services.prompt_builder import build_plan_prompts
from app.services.response_validator import (
  PlanOutputValidationError,
  validate_plan_output,
)
from app.services.safety import SafetyResult, SafetyStatus, build_boundary_message


class AIPlanGenerationError(RuntimeError):
  def __init__(self, reason: str):
    super().__init__(reason)
    self.reason = reason


def generate_ai_plan(
  intake: IntakeSchema,
  safety_result: SafetyResult,
) -> PlanSchema:
  if safety_result.safety_status in {
    SafetyStatus.CRISIS,
    SafetyStatus.URGENT_DENTAL_OR_MEDICAL,
  }:
    raise AIPlanGenerationError("safety_status_not_ai_eligible")

  if settings.ai_provider != "openai":
    raise AIPlanGenerationError("unsupported_ai_provider")

  if not settings.openai_api_key:
    raise AIPlanGenerationError("missing_openai_api_key")

  system_prompt, user_prompt = build_plan_prompts(intake, safety_result)

  try:
    response = _create_openai_response(system_prompt, user_prompt)
    raw_json = _extract_response_text(response)
    parsed = json.loads(raw_json)
    plan = PlanSchema.model_validate(parsed)
  except json.JSONDecodeError as exc:
    raise AIPlanGenerationError("invalid_json") from exc
  except ValidationError as exc:
    raise AIPlanGenerationError("schema_validation_failed") from exc
  except AIPlanGenerationError:
    raise
  except Exception as exc:
    raise AIPlanGenerationError("api_failure") from exc

  try:
    validate_plan_output(plan)
    _validate_expected_status(plan, safety_result)
  except PlanOutputValidationError as exc:
    raise AIPlanGenerationError(exc.reason) from exc

  return plan


def _create_openai_response(system_prompt: str, user_prompt: str) -> Any:
  openai_client_class = _get_openai_client_class()
  client = openai_client_class(
    api_key=settings.openai_api_key,
    timeout=float(settings.ai_request_timeout_seconds),
  )

  return client.responses.create(
    model=settings.openai_model,
    instructions=system_prompt,
    input=user_prompt,
    text={
      "format": {
        "type": "json_schema",
        "name": "smileatease_plan",
        "schema": PlanSchema.model_json_schema(),
        "strict": False,
      },
    },
  )


def _get_openai_client_class():
  try:
    from openai import OpenAI
  except Exception as exc:
    raise AIPlanGenerationError("openai_sdk_unavailable") from exc

  return OpenAI


def _extract_response_text(response: Any) -> str:
  output_text = getattr(response, "output_text", None)
  if isinstance(output_text, str) and output_text.strip():
    return output_text

  raise AIPlanGenerationError("missing_output_text")


def _validate_expected_status(
  plan: PlanSchema,
  safety_result: SafetyResult,
) -> None:
  if safety_result.safety_status == SafetyStatus.BOUNDARY:
    if plan.safety_status != PlanSafetyStatus.BOUNDARY:
      raise PlanOutputValidationError("boundary_status_mismatch")

    if build_boundary_message() not in plan.important_reminder:
      raise PlanOutputValidationError("missing_boundary_reminder")

    return

  if plan.safety_status not in {
    PlanSafetyStatus.STANDARD,
    PlanSafetyStatus.FALLBACK,
  }:
    raise PlanOutputValidationError("standard_status_mismatch")
