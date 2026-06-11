from __future__ import annotations

import pytest
from pydantic import ValidationError

from app.schemas.assessment import IntakeSchema


def valid_intake_data(**overrides: object) -> dict[str, object]:
  data: dict[str, object] = {
    "appointment_status": "within_month",
    "visit_type": "cleaning_checkup",
    "plan_for": "me",
    "worries": ["pain", "needles"],
    "biggest_worry": "pain",
    "last_visit": "within_6_months",
    "bad_experience_level": "no",
    "include_bad_experience_note": None,
    "communication_preferences": ["explain_each_step"],
    "communication_style": "calm_direct",
    "coping_preferences": ["headphones"],
    "include_calming_script": True,
    "optional_context": "Please keep explanations calm and clear.",
    "urgent_symptoms": ["none"],
    "self_harm_risk": "no",
    "disclaimer_acknowledged": True,
  }
  data.update(overrides)
  return data


def test_valid_intake_passes_and_calculates_concern_score() -> None:
  intake = IntakeSchema.model_validate(valid_intake_data())

  assert intake.concern_score == 4


def test_structured_fields_calculate_concern_score() -> None:
  intake = IntakeSchema.model_validate(
    valid_intake_data(
      visit_type="first_visit_long_time",
      worries=[
        "pain",
        "needles",
        "embarrassment",
        "judgment",
        "loss_of_control",
        "bad_past_experience",
        "gagging",
        "cost",
        "communication",
      ],
      biggest_worry="loss_of_control",
      last_visit="never",
      bad_experience_level="very_upsetting",
    ),
  )

  assert intake.concern_score == 20


def test_missing_required_field_fails() -> None:
  data = valid_intake_data()
  data.pop("visit_type")

  with pytest.raises(ValidationError):
    IntakeSchema.model_validate(data)


def test_biggest_worry_must_be_selected_worry() -> None:
  data = valid_intake_data(worries=["pain"], biggest_worry="needles")

  with pytest.raises(ValidationError, match="biggest_worry"):
    IntakeSchema.model_validate(data)


def test_intensity_and_pause_signal_are_not_required() -> None:
  intake = IntakeSchema.model_validate(valid_intake_data())

  assert not hasattr(intake, "intensity")
  assert not hasattr(intake, "pause_signal")


@pytest.mark.parametrize(
  ("field", "value"),
  [
    ("bad_experience_level", "not_sure"),
    ("communication_style", "not_sure"),
  ],
)
def test_removed_single_choice_values_fail(field: str, value: str) -> None:
  data = valid_intake_data(**{field: value})

  with pytest.raises(ValidationError):
    IntakeSchema.model_validate(data)


@pytest.mark.parametrize(
  "coping_preference",
  ["breathing", "know_steps", "look_away", "none"],
)
def test_removed_coping_preferences_fail(coping_preference: str) -> None:
  data = valid_intake_data(coping_preferences=[coping_preference])

  with pytest.raises(ValidationError):
    IntakeSchema.model_validate(data)


def test_urgent_symptoms_none_with_another_value_fails() -> None:
  data = valid_intake_data(
    urgent_symptoms=["none", "rapid_swelling"],
  )

  with pytest.raises(ValidationError, match="urgent_symptoms"):
    IntakeSchema.model_validate(data)


def test_disclaimer_acknowledged_false_fails() -> None:
  data = valid_intake_data(disclaimer_acknowledged=False)

  with pytest.raises(ValidationError):
    IntakeSchema.model_validate(data)


def test_optional_context_over_700_characters_fails() -> None:
  data = valid_intake_data(optional_context="a" * 701)

  with pytest.raises(ValidationError):
    IntakeSchema.model_validate(data)
