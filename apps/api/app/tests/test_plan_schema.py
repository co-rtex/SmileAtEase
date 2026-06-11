from __future__ import annotations

import pytest
from pydantic import ValidationError

from app.schemas.plan import PlanSchema


def valid_plan_data(**overrides: object) -> dict[str, object]:
  data: dict[str, object] = {
    "safety_status": "standard",
    "title": "Your Dental Visit Preparation Plan",
    "gentle_summary": "A calm summary.",
    "main_concerns": ["Pain"],
    "before_visit": ["Write down your questions."],
    "when_you_arrive": ["Confirm your pause signal."],
    "during_visit": ["Use your pause signal if needed."],
    "if_overwhelmed": ["Ask for a short break."],
    "questions_to_ask": ["What will happen first?"],
    "comfort_card": {
      "intro": "I feel nervous during dental visits.",
      "my_concerns": ["Pain"],
      "what_helps_me": ["Please explain each step."],
      "pause_signal": "I will raise my right hand if I need a break.",
      "communication_preference": "Calm, direct communication helps me.",
    },
    "important_reminder": "This plan is for preparation only.",
    "blocked_or_redirect_message": None,
  }
  data.update(overrides)
  return data


def test_valid_standard_plan_passes() -> None:
  plan = PlanSchema.model_validate(valid_plan_data())

  assert plan.safety_status == "standard"


def test_invalid_safety_status_fails() -> None:
  with pytest.raises(ValidationError):
    PlanSchema.model_validate(valid_plan_data(safety_status="unsafe"))


def test_missing_comfort_card_fails() -> None:
  data = valid_plan_data()
  data.pop("comfort_card")

  with pytest.raises(ValidationError):
    PlanSchema.model_validate(data)
