from __future__ import annotations

import pytest

from app.schemas.assessment import IntakeSchema
from app.services.safety import (
  SafetyStatus,
  build_boundary_message,
  build_crisis_response,
  build_urgent_response,
  evaluate_safety,
)


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
    "coping_preferences": [],
    "include_calming_script": True,
    "optional_context": None,
    "urgent_symptoms": ["none"],
    "self_harm_risk": "no",
    "disclaimer_acknowledged": True,
  }
  data.update(overrides)
  return IntakeSchema.model_validate(data)


def test_standard_intake_returns_standard() -> None:
  result = evaluate_safety(intake())

  assert result.safety_status == SafetyStatus.STANDARD
  assert result.reasons == []
  assert result.boundary_message is None


def test_self_harm_risk_yes_returns_crisis() -> None:
  result = evaluate_safety(intake(self_harm_risk="yes"))

  assert result.safety_status == SafetyStatus.CRISIS
  assert "self_harm_risk_yes" in result.reasons


def test_self_harm_text_returns_crisis() -> None:
  result = evaluate_safety(
    intake(optional_context="<p>I cannot stay safe tonight.</p>"),
  )

  assert result.safety_status == SafetyStatus.CRISIS
  assert "self_harm_text:cannot stay safe" in result.reasons


def test_self_harm_text_inside_optional_context_prioritizes_crisis() -> None:
  result = evaluate_safety(
    intake(optional_context="I want to die and need help."),
  )

  assert result.safety_status == SafetyStatus.CRISIS
  assert "self_harm_text:want to die" in result.reasons


def test_urgent_symptom_returns_urgent_dental_or_medical() -> None:
  result = evaluate_safety(
    intake(urgent_symptoms=["trouble_breathing_swallowing"]),
  )

  assert result.safety_status == SafetyStatus.URGENT_DENTAL_OR_MEDICAL
  assert "urgent_symptom:trouble_breathing_swallowing" in result.reasons


@pytest.mark.parametrize(
  "optional_context,reason",
  [
    ("Should I take medication first?", "boundary:medication"),
    ("Should I ask for sedation?", "boundary:sedation"),
    ("Can you give me a diagnosis?", "boundary:diagnosis"),
  ],
)
def test_boundary_requests_return_boundary(
  optional_context: str,
  reason: str,
) -> None:
  result = evaluate_safety(intake(optional_context=optional_context))

  assert result.safety_status == SafetyStatus.BOUNDARY
  assert reason in result.reasons
  assert result.boundary_message == build_boundary_message()


def test_crisis_overrides_urgent() -> None:
  result = evaluate_safety(
    intake(
      self_harm_risk="yes",
      urgent_symptoms=["rapid_swelling"],
    ),
  )

  assert result.safety_status == SafetyStatus.CRISIS


def test_crisis_overrides_urgent_and_boundary() -> None:
  result = evaluate_safety(
    intake(
      self_harm_risk="yes",
      urgent_symptoms=["rapid_swelling"],
      optional_context="Should I ask for sedation?",
    ),
  )

  assert result.safety_status == SafetyStatus.CRISIS
  assert result.boundary_message is None


def test_urgent_overrides_boundary() -> None:
  result = evaluate_safety(
    intake(
      urgent_symptoms=["rapid_swelling"],
      optional_context="Should I take antibiotics?",
    ),
  )

  assert result.safety_status == SafetyStatus.URGENT_DENTAL_OR_MEDICAL
  assert result.boundary_message is None


def test_urgent_plus_medication_request_prioritizes_urgent() -> None:
  result = evaluate_safety(
    intake(
      urgent_symptoms=["uncontrolled_bleeding"],
      optional_context="Should I take medication first?",
    ),
  )

  assert result.safety_status == SafetyStatus.URGENT_DENTAL_OR_MEDICAL
  assert result.boundary_message is None


def test_response_builders_return_required_text() -> None:
  assert (
    build_crisis_response()
    == "If you might hurt yourself or cannot stay safe, call or text 988 in "
    "the U.S. and Canada, or contact local emergency services now."
  )
  assert (
    build_urgent_response()
    == "Your answers include symptoms that may need urgent professional care. "
    "Contact a dentist, medical professional, or emergency service now. If "
    "you are having trouble breathing or swallowing, seek emergency medical "
    "care immediately."
  )
