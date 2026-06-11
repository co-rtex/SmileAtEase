from __future__ import annotations

from collections.abc import Generator
from datetime import UTC, datetime, timedelta
from uuid import UUID

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app
from app.models.assessment import Assessment
from app.models.audit_event import AuditEvent
from app.models.plan import Plan


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
    "communication_preferences": ["explain_each_step"],
    "communication_style": "calm_direct",
    "coping_preferences": ["headphones"],
    "include_calming_script": True,
    "optional_context": None,
    "urgent_symptoms": ["none"],
    "self_harm_risk": "no",
    "disclaimer_acknowledged": True,
  }
  data.update(overrides)
  return data


def post_generate(client: TestClient, **intake_overrides: object):
  return client.post(
    "/api/plans/generate",
    json={
      "anonymous_session_id": "session-123",
      "intake": valid_intake_data(**intake_overrides),
    },
  )


def test_generate_creates_assessment_and_plan(
  client: TestClient,
  db_session: Session,
) -> None:
  response = post_generate(client)

  assert response.status_code == 200
  payload = response.json()
  plan_id = UUID(payload["plan_id"])
  assessment_id = UUID(payload["assessment_id"])
  assert payload["safety_status"] == "standard"
  assert payload["plan"]["safety_status"] == "standard"

  assessment = db_session.get(Assessment, assessment_id)
  plan = db_session.get(Plan, plan_id)
  assert assessment is not None
  assert plan is not None
  assert plan.assessment_id == assessment.id
  assert plan.prompt_version == "rule_based_v1"
  assert plan.model_used is None


def test_get_plan_returns_saved_plan(client: TestClient) -> None:
  create_response = post_generate(client)
  plan_id = create_response.json()["plan_id"]

  response = client.get(f"/api/plans/{plan_id}")

  assert response.status_code == 200
  assert response.json()["plan_id"] == plan_id
  assert response.json()["plan"]["title"] == "Your Dental Visit Preparation Plan"


def test_delete_plan_soft_deletes_plan(
  client: TestClient,
  db_session: Session,
) -> None:
  create_response = post_generate(client)
  plan_id = UUID(create_response.json()["plan_id"])

  response = client.delete(f"/api/plans/{plan_id}")
  plan = db_session.get(Plan, plan_id)

  assert response.status_code == 200
  assert response.json() == {"deleted": True}
  assert plan is not None
  assert plan.deleted_at is not None


def test_deleted_plan_returns_404(client: TestClient) -> None:
  create_response = post_generate(client)
  plan_id = create_response.json()["plan_id"]

  client.delete(f"/api/plans/{plan_id}")
  response = client.get(f"/api/plans/{plan_id}")

  assert response.status_code == 404


def test_expired_plan_returns_404(
  client: TestClient,
  db_session: Session,
) -> None:
  create_response = post_generate(client)
  plan_id = UUID(create_response.json()["plan_id"])
  plan = db_session.get(Plan, plan_id)
  assert plan is not None
  plan.expires_at = datetime.now(UTC).replace(tzinfo=None) - timedelta(days=1)
  db_session.commit()

  response = client.get(f"/api/plans/{plan_id}")

  assert response.status_code == 404


def test_crisis_input_creates_crisis_plan(client: TestClient) -> None:
  response = post_generate(client, self_harm_risk="yes")

  assert response.status_code == 200
  assert response.json()["safety_status"] == "crisis"
  assert response.json()["plan"]["before_visit"] == []


def test_urgent_input_creates_urgent_plan(client: TestClient) -> None:
  response = post_generate(client, urgent_symptoms=["rapid_swelling"])

  assert response.status_code == 200
  assert response.json()["safety_status"] == "urgent_dental_or_medical"
  assert response.json()["plan"]["questions_to_ask"] == []


def test_boundary_input_creates_boundary_plan(client: TestClient) -> None:
  response = post_generate(
    client,
    optional_context="Should I ask for sedation?",
  )

  assert response.status_code == 200
  assert response.json()["safety_status"] == "boundary"
  assert "cannot recommend medication, sedation, diagnosis, or treatment" in (
    response.json()["plan"]["important_reminder"]
  )


def test_plan_created_audit_event_is_created(
  client: TestClient,
  db_session: Session,
) -> None:
  response = post_generate(client)
  plan_id = response.json()["plan_id"]
  assessment_id = UUID(response.json()["assessment_id"])

  audit_event = db_session.scalars(
    select(AuditEvent).where(
      AuditEvent.assessment_id == assessment_id,
      AuditEvent.event_type == "plan_created",
    ),
  ).one()

  assert audit_event.metadata_json == {
    "plan_id": plan_id,
    "safety_status": "standard",
    "prompt_version": "rule_based_v1",
  }


def test_invalid_intake_returns_422(client: TestClient) -> None:
  response = client.post(
    "/api/plans/generate",
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
