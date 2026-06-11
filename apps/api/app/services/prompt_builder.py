from __future__ import annotations

import json
from pathlib import Path

from app.schemas.assessment import IntakeSchema
from app.services.safety import SafetyResult
from app.services.sanitizer import sanitize_optional_context

PROMPT_DIR = Path(__file__).resolve().parents[1] / "prompts"
SYSTEM_PROMPT_PATH = PROMPT_DIR / "plan_system_prompt.txt"
USER_PROMPT_TEMPLATE_PATH = PROMPT_DIR / "plan_user_prompt_template.txt"


def build_plan_prompts(
  intake: IntakeSchema,
  safety_result: SafetyResult,
) -> tuple[str, str]:
  system_prompt = SYSTEM_PROMPT_PATH.read_text(encoding="utf-8")
  user_prompt_template = USER_PROMPT_TEMPLATE_PATH.read_text(
    encoding="utf-8",
  )
  intake_json = json.dumps(
    _structured_prompt_data(intake, safety_result),
    ensure_ascii=False,
    sort_keys=True,
  )

  return (
    system_prompt,
    user_prompt_template.replace("{{INTAKE_JSON}}", intake_json),
  )


def _structured_prompt_data(
  intake: IntakeSchema,
  safety_result: SafetyResult,
) -> dict[str, object]:
  data = intake.model_dump(mode="json")
  data["optional_context"] = sanitize_optional_context(
    intake.optional_context,
  )
  data["safety_status"] = safety_result.safety_status.value
  data["boundary_message"] = safety_result.boundary_message

  return data
