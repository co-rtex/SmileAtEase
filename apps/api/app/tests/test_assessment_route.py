from __future__ import annotations

from collections.abc import Generator
from uuid import UUID

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app
from app.models.assessment import (
  Assessment,
  AssessmentWorry,
  CommunicationPreference,
  CopingPreference,
)
from app.models.audit_event import AuditEvent


@pytest.fixture()
def db_session() -> Generator[Session]:
  engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
  )
  Base.metadata.create_all(bind=engine)
  testing_session = sessionmaker(bind=engine, autoflush=False, autocommit=False)
  session = testing_session()

  try:
    yield session
  finally:
    session.close()
    Base.metadata.drop_all(bind=engine)
    engine.dispose()


@pytest.fixture()
def client(db_session: Session) -> Generator[TestClient]:
  def override_get_db() -> Generator[Session]:
    yield db_session

  app.dependency_overrides[get_db] = override_get_db

  with TestClient(app) as test_client:
    yield test_client

  app.dependency_overrides.clear()


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
    "communication_preferences": [
      "explain_each_step",
      "check_in_during_visit",
    ],
    "communication_style": "calm_direct",
    "coping_preferences": ["headphones", "counting"],
    "include_calming_script": True,
    "optional_context": "Please explain each step.",
    "urgent_symptoms": ["none"],
    "self_harm_risk": "no",
    "disclaimer_acknowledged": True,
  }
  data.update(overrides)
  return data


def post_assessment(
  client: TestClient,
  **intake_overrides: object,
):
  return client.post(
    "/api/assessments",
    json={
      "anonymous_session_id": "session-123",
      "intake": valid_intake_data(**intake_overrides),
    },
  )


def test_valid_standard_intake_creates_assessment(
  client: TestClient,
  db_session: Session,
) -> None:
  response = post_assessment(client)

  assert response.status_code == 200
  payload = response.json()
  assessment_id = UUID(payload["assessment_id"])
  assert payload == {
    "assessment_id": str(assessment_id),
    "concern_score": 4,
    "safety_status": "standard",
    "urgent_flag": False,
    "self_harm_flag": False,
    "boundary_flag": False,
  }

  assessment = db_session.get(Assessment, assessment_id)
  assert assessment is not None
  assert assessment.anonymous_session_id == "session-123"
  assert assessment.concern_score == 4
  assert assessment.optional_context_present is True
  assert "optional_context" not in Assessment.__table__.columns


def test_assessment_route_stores_related_options(
  client: TestClient,
  db_session: Session,
) -> None:
  response = post_assessment(client)
  assessment_id = UUID(response.json()["assessment_id"])

  worries = db_session.scalars(
    select(AssessmentWorry.worry_key).where(
      AssessmentWorry.assessment_id == assessment_id,
    ),
  ).all()
  communication_preferences = db_session.scalars(
    select(CommunicationPreference.preference_key).where(
      CommunicationPreference.assessment_id == assessment_id,
    ),
  ).all()
  coping_preferences = db_session.scalars(
    select(CopingPreference.coping_key).where(
      CopingPreference.assessment_id == assessment_id,
    ),
  ).all()

  assert set(worries) == {"pain", "needles"}
  assert set(communication_preferences) == {
    "explain_each_step",
    "check_in_during_visit",
  }
  assert set(coping_preferences) == {"headphones", "counting"}


def test_assessment_route_creates_audit_event_without_optional_text(
  client: TestClient,
  db_session: Session,
) -> None:
  response = post_assessment(
    client,
    optional_context="<p>Please explain first.</p>",
  )
  assessment_id = UUID(response.json()["assessment_id"])

  audit_event = db_session.scalars(
    select(AuditEvent).where(AuditEvent.assessment_id == assessment_id),
  ).one()

  assert audit_event.event_type == "assessment_created"
  assert audit_event.metadata_json == {
    "safety_status": "standard",
    "urgent_flag": False,
    "self_harm_flag": False,
    "boundary_flag": False,
    "optional_context_present": True,
  }
  assert "Please explain" not in str(audit_event.metadata_json)


def test_urgent_intake_sets_urgent_flag(client: TestClient) -> None:
  response = post_assessment(client, urgent_symptoms=["rapid_swelling"])

  assert response.status_code == 200
  assert response.json()["safety_status"] == "urgent_dental_or_medical"
  assert response.json()["urgent_flag"] is True
  assert response.json()["self_harm_flag"] is False
  assert response.json()["boundary_flag"] is False


def test_crisis_intake_sets_self_harm_flag(client: TestClient) -> None:
  response = post_assessment(client, self_harm_risk="yes")

  assert response.status_code == 200
  assert response.json()["safety_status"] == "crisis"
  assert response.json()["urgent_flag"] is False
  assert response.json()["self_harm_flag"] is True
  assert response.json()["boundary_flag"] is False


def test_boundary_intake_sets_boundary_flag(client: TestClient) -> None:
  response = post_assessment(
    client,
    optional_context="Should I ask for sedation?",
  )

  assert response.status_code == 200
  assert response.json()["safety_status"] == "boundary"
  assert response.json()["urgent_flag"] is False
  assert response.json()["self_harm_flag"] is False
  assert response.json()["boundary_flag"] is True


def test_invalid_intake_returns_422(client: TestClient) -> None:
  response = client.post(
    "/api/assessments",
    json={
      "intake": valid_intake_data(
        worries=["pain"],
        biggest_worry="needles",
      ),
    },
  )

  assert response.status_code == 422


def test_health_still_returns_ok(client: TestClient) -> None:
  response = client.get("/api/health")

  assert response.status_code == 200
  assert response.json() == {"status": "ok"}
