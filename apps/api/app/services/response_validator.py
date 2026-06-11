from __future__ import annotations

import re

from app.schemas.plan import PlanSchema, SafetyStatus


class PlanOutputValidationError(ValueError):
  def __init__(self, reason: str):
    super().__init__(reason)
    self.reason = reason


FORBIDDEN_PHRASES = (
  "you have",
  "you likely have",
  "you are diagnosed with",
  "you need a root canal",
  "you need an extraction",
  "take ibuprofen",
  "take tylenol",
  "take antibiotics",
  "ask for sedation",
  "ask for nitrous",
  "this will cure",
  "this will treat your anxiety",
)
DOSAGE_RE = re.compile(r"\b\d+\s?(mg|ml|milligrams|pills|tablets)\b", re.I)


def validate_plan_output(plan: PlanSchema) -> None:
  text = _plan_text(plan)
  normalized = text.lower()

  if plan.safety_status in {
    SafetyStatus.STANDARD,
    SafetyStatus.BOUNDARY,
    SafetyStatus.FALLBACK,
  }:
    _validate_normal_plan(plan)

  if plan.safety_status == SafetyStatus.STANDARD:
    _reject_standard_blocked_response(plan, normalized)

  for phrase in FORBIDDEN_PHRASES:
    if phrase in normalized:
      raise PlanOutputValidationError(f"forbidden_phrase:{phrase}")

  if DOSAGE_RE.search(text):
    raise PlanOutputValidationError("dosage_pattern")


def _validate_normal_plan(plan: PlanSchema) -> None:
  if (
    not plan.gentle_summary.strip()
    or not plan.main_concerns
    or not plan.before_visit
    or not plan.during_visit
    or not plan.questions_to_ask
    or not plan.important_reminder.strip()
  ):
    raise PlanOutputValidationError("incomplete_normal_plan")

  comfort_card = plan.comfort_card
  if (
    not comfort_card.intro.strip()
    or not comfort_card.my_concerns
    or not comfort_card.what_helps_me
    or not comfort_card.pause_signal.strip()
    or not comfort_card.communication_preference.strip()
  ):
    raise PlanOutputValidationError("missing_comfort_card")


def _reject_standard_blocked_response(
  plan: PlanSchema,
  normalized: str,
) -> None:
  if plan.blocked_or_redirect_message is not None:
    raise PlanOutputValidationError("blocked_message_in_standard_plan")

  if (
    "immediate support may be needed" in normalized
    or "this may need urgent care" in normalized
    or "cannot provide crisis support" in normalized
    or "cannot evaluate urgent symptoms" in normalized
  ):
    raise PlanOutputValidationError("safety_block_in_standard_plan")


def _plan_text(plan: PlanSchema) -> str:
  return " ".join(
    [
      plan.safety_status.value,
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
  )
