from __future__ import annotations

import pytest
from pydantic import ValidationError

from app.schemas.plan import PlanSchema
from app.services.response_validator import (
  PlanOutputValidationError,
  validate_plan_output,
)


def valid_plan_data(**overrides: object) -> dict[str, object]:
  data: dict[str, object] = {
    "safety_status": "standard",
    "title": "Your Dental Visit Preparation Plan",
    "gentle_summary": "This plan helps you prepare what to ask and share.",
    "main_concerns": ["Pain"],
    "before_visit": ["Write down your questions."],
    "when_you_arrive": ["Confirm your pause signal."],
    "during_visit": ["Use your pause signal if you need a break."],
    "if_overwhelmed": ["Ask for a short break."],
    "questions_to_ask": ["What will happen first?"],
    "comfort_card": {
      "intro": "I feel nervous during dental visits.",
      "my_concerns": ["Pain"],
      "what_helps_me": ["Please explain each step."],
      "pause_signal": "I will raise my hand if I need a break.",
      "communication_preference": "Calm and direct communication helps me.",
    },
    "important_reminder": "This plan is for preparation only.",
    "blocked_or_redirect_message": None,
  }
  data.update(overrides)
  return data


def validate(data: dict[str, object]) -> None:
  validate_plan_output(PlanSchema.model_validate(data))


def test_response_validator_accepts_safe_standard_plan() -> None:
  validate(valid_plan_data())


@pytest.mark.parametrize(
  "text",
  [
    "You have an infection.",
    "You are diagnosed with a dental phobia.",
    "Take ibuprofen before you go.",
    "Ask for sedation.",
    "Ask for nitrous.",
    "Take 200 mg before the visit.",
    "Take 2 pills before the visit.",
    "You need a root canal.",
    "You need an extraction.",
  ],
)
def test_response_validator_rejects_unsafe_content(text: str) -> None:
  with pytest.raises(PlanOutputValidationError):
    validate(valid_plan_data(during_visit=[text]))


def test_response_validator_rejects_missing_comfort_card() -> None:
  data = valid_plan_data()
  data.pop("comfort_card")

  with pytest.raises(ValidationError):
    PlanSchema.model_validate(data)


def test_response_validator_rejects_crisis_style_standard_plan() -> None:
  with pytest.raises(PlanOutputValidationError):
    validate(
      valid_plan_data(
        title="Immediate support may be needed",
        blocked_or_redirect_message="If you cannot stay safe, call 988.",
      ),
    )
