from __future__ import annotations

from datetime import UTC, datetime, timedelta

from app.database import Base
from app.models.assessment import Assessment
from app.models.audit_event import AuditEvent
from app.models.plan import Plan


def test_database_metadata_contains_assessment_tables() -> None:
  assert {
    "assessments",
    "assessment_worries",
    "communication_preferences",
    "coping_preferences",
    "audit_events",
    "plans",
  }.issubset(Base.metadata.tables.keys())


def test_assessment_model_has_expected_minimal_columns() -> None:
  columns = Assessment.__table__.columns

  assert "id" in columns
  assert "anonymous_session_id" in columns
  assert "concern_score" in columns
  assert "urgent_flag" in columns
  assert "self_harm_flag" in columns
  assert "boundary_flag" in columns
  assert "optional_context_present" in columns
  assert "expires_at" in columns
  assert "optional_context" not in columns


def test_assessment_can_be_constructed_with_expiration() -> None:
  expires_at = datetime.now(UTC).replace(tzinfo=None) + timedelta(days=7)

  assessment = Assessment(
    anonymous_session_id="session-123",
    appointment_status="within_month",
    visit_type="cleaning_checkup",
    plan_for="me",
    biggest_worry="pain",
    last_visit="within_6_months",
    bad_experience_level="no",
    concern_score=5,
    expires_at=expires_at,
  )

  assert assessment.expires_at == expires_at
  assert assessment.concern_score == 5


def test_audit_event_model_uses_metadata_json_column() -> None:
  columns = AuditEvent.__table__.columns

  assert "metadata_json" in columns
  assert "metadata" not in columns


def test_plan_model_has_expected_columns() -> None:
  columns = Plan.__table__.columns

  assert "id" in columns
  assert "assessment_id" in columns
  assert "plan_json" in columns
  assert "safety_status" in columns
  assert "model_used" in columns
  assert "prompt_version" in columns
  assert "expires_at" in columns
  assert "deleted_at" in columns
