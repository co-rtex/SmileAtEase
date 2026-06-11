from __future__ import annotations

from collections.abc import Generator
from uuid import UUID

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

import app.routes.plans as plan_routes
from app.config import settings
from app.database import Base, get_db
from app.main import app
from app.models.audit_event import AuditEvent
from app.models.plan import Plan
from app.schemas.plan import ComfortCardSchema, PlanSchema, SafetyStatus
from app.services.ai_plan_generator import AIPlanGenerationError
from app.services.safety import build_boundary_message


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
    "worries": ["pain"],
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


def ai_plan(safety_status: SafetyStatus = SafetyStatus.STANDARD) -> PlanSchema:
  important_reminder = "This plan is for preparation only."
  if safety_status == SafetyStatus.BOUNDARY:
    important_reminder = (
      f"{important_reminder} {build_boundary_message()}"
    )

  return PlanSchema(
    safety_status=safety_status,
    title="AI Visit Preparation Plan",
    gentle_summary="This AI plan helps organize questions and preferences.",
    main_concerns=["Pain"],
    before_visit=["Write down your questions."],
    when_you_arrive=["Confirm your pause signal."],
    during_visit=["Use your pause signal if needed."],
    if_overwhelmed=["Ask for a short break."],
    questions_to_ask=["What will happen first?"],
    comfort_card=ComfortCardSchema(
      intro="I feel nervous during dental visits.",
      my_concerns=["Pain"],
      what_helps_me=["Please explain each step."],
      pause_signal="I will raise my hand if I need a break.",
      communication_preference="Calm and direct communication helps me.",
    ),
    important_reminder=important_reminder,
    blocked_or_redirect_message=None,
  )


def test_rule_based_mode_preserves_rule_based_generation(
  client: TestClient,
  db_session: Session,
  monkeypatch: pytest.MonkeyPatch,
) -> None:
  monkeypatch.setattr(settings, "ai_plan_mode", "rule_based")
  response = post_generate(client)
  plan_id = UUID(response.json()["plan_id"])
  plan = db_session.get(Plan, plan_id)

  assert response.status_code == 200
  assert response.json()["plan"]["title"] == "Your Dental Visit Preparation Plan"
  assert plan is not None
  assert plan.prompt_version == "rule_based_v1"
  assert plan.model_used is None


def test_ai_mode_valid_ai_response_saves_ai_plan(
  client: TestClient,
  db_session: Session,
  monkeypatch: pytest.MonkeyPatch,
) -> None:
  monkeypatch.setattr(settings, "ai_plan_mode", "ai")
  monkeypatch.setattr(settings, "openai_model", "test-model")
  monkeypatch.setattr(plan_routes, "generate_ai_plan", lambda *_: ai_plan())

  response = post_generate(client)
  plan_id = UUID(response.json()["plan_id"])
  assessment_id = UUID(response.json()["assessment_id"])
  plan = db_session.get(Plan, plan_id)
  audit_event = db_session.scalars(
    select(AuditEvent).where(
      AuditEvent.assessment_id == assessment_id,
      AuditEvent.event_type == "ai_plan_created",
    ),
  ).one()

  assert response.status_code == 200
  assert response.json()["plan"]["title"] == "AI Visit Preparation Plan"
  assert plan is not None
  assert plan.prompt_version == "ai_v1"
  assert plan.model_used == "test-model"
  assert audit_event.metadata_json == {
    "model": "test-model",
    "safety_status": "standard",
    "fallback_used": False,
  }


def test_ai_mode_invalid_ai_response_falls_back(
  client: TestClient,
  db_session: Session,
  monkeypatch: pytest.MonkeyPatch,
) -> None:
  def fail_ai(*_):
    raise AIPlanGenerationError("forbidden_phrase:ask for sedation")

  monkeypatch.setattr(settings, "ai_plan_mode", "ai")
  monkeypatch.setattr(settings, "openai_model", "test-model")
  monkeypatch.setattr(plan_routes, "generate_ai_plan", fail_ai)

  response = post_generate(client)
  plan_id = UUID(response.json()["plan_id"])
  assessment_id = UUID(response.json()["assessment_id"])
  plan = db_session.get(Plan, plan_id)
  fallback_event = db_session.scalars(
    select(AuditEvent).where(
      AuditEvent.assessment_id == assessment_id,
      AuditEvent.event_type == "ai_plan_fallback_used",
    ),
  ).one()

  assert response.status_code == 200
  assert response.json()["plan"]["title"] == "Your Dental Visit Preparation Plan"
  assert plan is not None
  assert plan.prompt_version == "rule_based_v1"
  assert plan.model_used is None
  assert fallback_event.metadata_json == {
    "model": "test-model",
    "safety_status": "standard",
    "rejection_reason": "forbidden_phrase:ask for sedation",
    "fallback_used": True,
  }


@pytest.mark.parametrize(
  "overrides",
  [
    {"self_harm_risk": "yes"},
    {"urgent_symptoms": ["rapid_swelling"]},
  ],
)
def test_crisis_and_urgent_do_not_call_ai(
  client: TestClient,
  monkeypatch: pytest.MonkeyPatch,
  overrides: dict[str, object],
) -> None:
  def fail_if_called(*_):
    raise AssertionError("AI should not be called")

  monkeypatch.setattr(settings, "ai_plan_mode", "ai")
  monkeypatch.setattr(plan_routes, "generate_ai_plan", fail_if_called)

  response = post_generate(client, **overrides)

  assert response.status_code == 200
  assert response.json()["safety_status"] in {
    "crisis",
    "urgent_dental_or_medical",
  }


def test_boundary_input_can_use_ai_with_boundary_status(
  client: TestClient,
  db_session: Session,
  monkeypatch: pytest.MonkeyPatch,
) -> None:
  monkeypatch.setattr(settings, "ai_plan_mode", "ai")
  monkeypatch.setattr(settings, "openai_model", "test-model")
  monkeypatch.setattr(
    plan_routes,
    "generate_ai_plan",
    lambda *_: ai_plan(SafetyStatus.BOUNDARY),
  )

  response = post_generate(
    client,
    optional_context="Should I ask for sedation?",
  )
  plan_id = UUID(response.json()["plan_id"])
  plan = db_session.get(Plan, plan_id)

  assert response.status_code == 200
  assert response.json()["safety_status"] == "boundary"
  assert build_boundary_message() in response.json()["plan"]["important_reminder"]
  assert plan is not None
  assert plan.prompt_version == "ai_v1"
