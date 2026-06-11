from __future__ import annotations

import json
from types import SimpleNamespace

import pytest

import app.services.ai_plan_generator as ai_plan_generator
from app.config import settings
from app.schemas.assessment import IntakeSchema
from app.services.ai_plan_generator import (
  AIPlanGenerationError,
  generate_ai_plan,
)
from app.services.safety import evaluate_safety


def intake(**overrides: object) -> IntakeSchema:
  data: dict[str, object] = {
    "appointment_status": "within_month",
    "visit_type": "cleaning_checkup",
    "plan_for": "me",
    "worries": ["pain"],
    "biggest_worry": "pain",
    "last_visit": "within_6_months",
    "bad_experience_level": "no",
    "include_bad_experience_note": None,
    "communication_preferences": ["explain_each_step"],
    "communication_style": "calm_direct",
    "coping_preferences": ["counting"],
    "include_calming_script": True,
    "optional_context": None,
    "urgent_symptoms": ["none"],
    "self_harm_risk": "no",
    "disclaimer_acknowledged": True,
  }
  data.update(overrides)
  return IntakeSchema.model_validate(data)


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


class FakeOpenAI:
  output_text = json.dumps(valid_plan_data())

  def __init__(self, *, api_key: str, timeout: float):
    self.api_key = api_key
    self.timeout = timeout
    self.responses = self

  def create(self, **kwargs):
    return SimpleNamespace(output_text=self.output_text)


def enable_openai(monkeypatch: pytest.MonkeyPatch) -> None:
  monkeypatch.setattr(FakeOpenAI, "output_text", json.dumps(valid_plan_data()))
  monkeypatch.setattr(settings, "ai_provider", "openai")
  monkeypatch.setattr(settings, "openai_api_key", "test-key")
  monkeypatch.setattr(settings, "openai_model", "test-model")
  monkeypatch.setattr(settings, "ai_request_timeout_seconds", 3)
  monkeypatch.setattr(
    ai_plan_generator,
    "_get_openai_client_class",
    lambda: FakeOpenAI,
  )


def test_ai_generator_returns_valid_plan_from_mocked_openai(
  monkeypatch: pytest.MonkeyPatch,
) -> None:
  enable_openai(monkeypatch)
  intake_data = intake()

  plan = generate_ai_plan(intake_data, evaluate_safety(intake_data))

  assert plan.safety_status == "standard"
  assert plan.title == "Your Dental Visit Preparation Plan"


def test_ai_generator_raises_for_invalid_json(
  monkeypatch: pytest.MonkeyPatch,
) -> None:
  enable_openai(monkeypatch)
  monkeypatch.setattr(FakeOpenAI, "output_text", "{not json")
  intake_data = intake()

  with pytest.raises(AIPlanGenerationError, match="invalid_json"):
    generate_ai_plan(intake_data, evaluate_safety(intake_data))


def test_ai_generator_raises_for_unsafe_content(
  monkeypatch: pytest.MonkeyPatch,
) -> None:
  enable_openai(monkeypatch)
  monkeypatch.setattr(
    FakeOpenAI,
    "output_text",
    json.dumps(valid_plan_data(during_visit=["Ask for sedation."])),
  )
  intake_data = intake()

  with pytest.raises(AIPlanGenerationError, match="forbidden_phrase"):
    generate_ai_plan(intake_data, evaluate_safety(intake_data))


def test_ai_generator_raises_when_api_key_missing(
  monkeypatch: pytest.MonkeyPatch,
) -> None:
  monkeypatch.setattr(settings, "ai_provider", "openai")
  monkeypatch.setattr(settings, "openai_api_key", "")
  intake_data = intake()

  with pytest.raises(AIPlanGenerationError, match="missing_openai_api_key"):
    generate_ai_plan(intake_data, evaluate_safety(intake_data))


@pytest.mark.parametrize(
  "overrides",
  [
    {"self_harm_risk": "yes"},
    {"urgent_symptoms": ["rapid_swelling"]},
  ],
)
def test_ai_generator_raises_for_crisis_or_urgent(
  monkeypatch: pytest.MonkeyPatch,
  overrides: dict[str, object],
) -> None:
  enable_openai(monkeypatch)
  intake_data = intake(**overrides)

  with pytest.raises(AIPlanGenerationError, match="safety_status_not_ai_eligible"):
    generate_ai_plan(intake_data, evaluate_safety(intake_data))
