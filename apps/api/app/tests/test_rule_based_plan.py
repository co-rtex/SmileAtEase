from __future__ import annotations

from app.schemas.assessment import IntakeSchema
from app.services.rule_based_plan import generate_rule_based_plan
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


def plan_text(plan) -> str:
  return " ".join(
    [
      plan.title,
      plan.gentle_summary,
      *plan.main_concerns,
      *plan.before_visit,
      *plan.when_you_arrive,
      *plan.during_visit,
      *plan.if_overwhelmed,
      *plan.questions_to_ask,
      plan.comfort_card.intro,
      *plan.comfort_card.my_concerns,
      *plan.comfort_card.what_helps_me,
      plan.comfort_card.pause_signal,
      plan.comfort_card.communication_preference,
      plan.important_reminder,
      plan.blocked_or_redirect_message or "",
    ],
  ).lower()


def generate(intake_data: IntakeSchema):
  return generate_rule_based_plan(intake_data, evaluate_safety(intake_data))


def test_standard_intake_returns_standard_plan() -> None:
  plan = generate(intake())

  assert plan.safety_status == "standard"
  assert plan.before_visit
  assert plan.comfort_card.my_concerns == ["Pain"]


def test_boundary_intake_returns_boundary_plan_with_reminder() -> None:
  plan = generate(intake(optional_context="Should I ask for sedation?"))

  assert plan.safety_status == "boundary"
  assert "cannot recommend medication, sedation, diagnosis, or treatment" in (
    plan.important_reminder
  )
  assert plan.before_visit


def test_crisis_intake_returns_safety_only_plan() -> None:
  plan = generate(intake(self_harm_risk="yes"))

  assert plan.safety_status == "crisis"
  assert plan.before_visit == []
  assert plan.during_visit == []
  assert plan.comfort_card.my_concerns == []
  assert "988" in (plan.blocked_or_redirect_message or "")


def test_urgent_intake_returns_safety_only_plan() -> None:
  plan = generate(intake(urgent_symptoms=["rapid_swelling"]))

  assert plan.safety_status == "urgent_dental_or_medical"
  assert plan.before_visit == []
  assert plan.questions_to_ask == []
  assert "urgent professional care" in (
    plan.blocked_or_redirect_message or ""
  )


def test_cost_worry_adds_cost_related_question() -> None:
  plan = generate(
    intake(worries=["pain", "cost"], biggest_worry="cost"),
  )

  assert "costs before doing anything additional" in plan_text(plan)


def test_embarrassment_or_judgment_adds_nonjudgmental_language() -> None:
  plan = generate(
    intake(worries=["judgment"], biggest_worry="judgment"),
  )

  assert "nonjudgmental" in plan_text(plan)


def test_not_knowing_adds_step_by_step_language() -> None:
  plan = generate(
    intake(worries=["not_knowing"], biggest_worry="not_knowing"),
  )

  assert "step-by-step" in plan_text(plan)


def test_pain_and_needles_do_not_include_medication_or_sedation_advice() -> None:
  plan = generate(
    intake(worries=["pain", "needles"], biggest_worry="needles"),
  )
  text = plan_text(plan)

  assert "medication" not in text
  assert "sedation" not in text
  assert "nitrous" not in text


def test_bad_past_experience_is_private_when_user_keeps_it_private() -> None:
  plan = generate(
    intake(
      worries=["bad_past_experience"],
      biggest_worry="bad_past_experience",
      include_bad_experience_note="no_keep_private",
    ),
  )

  assert "past experience" not in plan_text(plan)
  assert "past visit" not in plan_text(plan)
  assert "private concern" in plan_text(plan)


def test_generic_pause_signal_is_reflected_in_comfort_card() -> None:
  plan = generate(intake())

  assert plan.comfort_card.pause_signal == (
    "I would like to agree on a clear pause signal before the visit begins."
  )
