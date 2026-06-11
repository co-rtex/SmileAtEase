from __future__ import annotations

from datetime import UTC, datetime, timedelta
from uuid import uuid4

from sqlalchemy.orm import Session

from app.config import settings
from app.models.assessment import (
  Assessment,
  AssessmentWorry,
  CommunicationPreference,
  CopingPreference,
)
from app.models.audit_event import AuditEvent
from app.schemas.assessment import IntakeSchema
from app.services.safety import SafetyResult, SafetyStatus, evaluate_safety
from app.services.sanitizer import sanitize_optional_context


def expires_at_from_retention() -> datetime:
  return datetime.now(UTC).replace(tzinfo=None) + timedelta(
    days=settings.plan_retention_days,
  )


def create_assessment_from_intake(
  db: Session,
  intake: IntakeSchema,
  anonymous_session_id: str | None = None,
) -> tuple[Assessment, SafetyResult]:
  sanitized_optional_context = sanitize_optional_context(
    intake.optional_context,
  )
  safety_result = evaluate_safety(intake)
  safety_status = safety_result.safety_status
  urgent_flag = safety_status == SafetyStatus.URGENT_DENTAL_OR_MEDICAL
  self_harm_flag = safety_status == SafetyStatus.CRISIS
  boundary_flag = safety_status == SafetyStatus.BOUNDARY
  optional_context_present = sanitized_optional_context is not None

  assessment = Assessment(
    anonymous_session_id=anonymous_session_id or uuid4().hex,
    appointment_status=intake.appointment_status.value,
    visit_type=intake.visit_type.value,
    plan_for=intake.plan_for.value,
    biggest_worry=intake.biggest_worry.value,
    last_visit=intake.last_visit.value,
    bad_experience_level=intake.bad_experience_level.value,
    include_bad_experience_note=(
      intake.include_bad_experience_note.value
      if intake.include_bad_experience_note is not None
      else None
    ),
    concern_score=intake.concern_score,
    urgent_flag=urgent_flag,
    self_harm_flag=self_harm_flag,
    boundary_flag=boundary_flag,
    optional_context_present=optional_context_present,
    expires_at=expires_at_from_retention(),
    worries=[
      AssessmentWorry(worry_key=worry.value)
      for worry in intake.worries
    ],
    communication_preferences=[
      CommunicationPreference(preference_key=preference.value)
      for preference in intake.communication_preferences
    ],
    coping_preferences=[
      CopingPreference(coping_key=coping.value)
      for coping in intake.coping_preferences
    ],
  )

  db.add(assessment)
  db.flush()

  db.add(
    AuditEvent(
      event_type="assessment_created",
      assessment_id=assessment.id,
      metadata_json={
        "safety_status": safety_status.value,
        "urgent_flag": urgent_flag,
        "self_harm_flag": self_harm_flag,
        "boundary_flag": boundary_flag,
        "optional_context_present": optional_context_present,
      },
    ),
  )

  return assessment, safety_result
