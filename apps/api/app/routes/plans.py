from __future__ import annotations

from datetime import UTC, datetime
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.audit_event import AuditEvent
from app.models.plan import Plan
from app.schemas.plan import (
  DeletePlanResponse,
  GeneratePlanRequest,
  GeneratePlanResponse,
  GetPlanResponse,
  PlanSchema,
)
from app.services.ai_plan_generator import (
  AIPlanGenerationError,
  generate_ai_plan,
)
from app.services.assessment_persistence import create_assessment_from_intake
from app.services.rule_based_plan import generate_rule_based_plan
from app.services.safety import SafetyStatus

router = APIRouter(tags=["plans"])

AI_PROMPT_VERSION = "ai_v1"
RULE_BASED_PROMPT_VERSION = "rule_based_v1"


@router.post("/plans/generate", response_model=GeneratePlanResponse)
def generate_plan(
  payload: GeneratePlanRequest,
  db: Session = Depends(get_db),
) -> GeneratePlanResponse:
  assessment, safety_result = create_assessment_from_intake(
    db=db,
    intake=payload.intake,
    anonymous_session_id=payload.anonymous_session_id,
  )
  plan_schema, model_used, prompt_version = _generate_final_plan(
    db=db,
    assessment_id=assessment.id,
    intake=payload.intake,
    safety_result=safety_result,
  )
  plan = Plan(
    assessment_id=assessment.id,
    plan_json=plan_schema.model_dump(mode="json"),
    safety_status=plan_schema.safety_status.value,
    model_used=model_used,
    prompt_version=prompt_version,
    expires_at=assessment.expires_at,
  )

  db.add(plan)
  db.flush()
  db.add(
    AuditEvent(
      event_type="plan_created",
      assessment_id=assessment.id,
      metadata_json={
        "plan_id": str(plan.id),
        "safety_status": plan_schema.safety_status.value,
        "prompt_version": prompt_version,
      },
    ),
  )
  db.commit()
  db.refresh(assessment)
  db.refresh(plan)

  return GeneratePlanResponse(
    plan_id=plan.id,
    assessment_id=assessment.id,
    safety_status=plan_schema.safety_status,
    plan=plan_schema,
  )


@router.get("/plans/{plan_id}", response_model=GetPlanResponse)
def get_plan(
  plan_id: UUID,
  db: Session = Depends(get_db),
) -> GetPlanResponse:
  plan = _get_visible_plan(db, plan_id)
  plan_schema = PlanSchema.model_validate(plan.plan_json)

  return GetPlanResponse(
    plan_id=plan.id,
    assessment_id=plan.assessment_id,
    safety_status=plan_schema.safety_status,
    plan=plan_schema,
  )


@router.delete("/plans/{plan_id}", response_model=DeletePlanResponse)
def delete_plan(
  plan_id: UUID,
  db: Session = Depends(get_db),
) -> DeletePlanResponse:
  plan = db.get(Plan, plan_id)
  if plan is None or plan.deleted_at is not None:
    raise HTTPException(status_code=404, detail="Plan not found")

  plan.deleted_at = _now()
  db.commit()

  return DeletePlanResponse(deleted=True)


def _get_visible_plan(db: Session, plan_id: UUID) -> Plan:
  plan = db.get(Plan, plan_id)
  if (
    plan is None
    or plan.deleted_at is not None
    or plan.expires_at <= _now()
  ):
    raise HTTPException(status_code=404, detail="Plan not found")

  return plan


def _now() -> datetime:
  return datetime.now(UTC).replace(tzinfo=None)


def _generate_final_plan(
  *,
  db: Session,
  assessment_id: UUID,
  intake,
  safety_result,
) -> tuple[PlanSchema, str | None, str]:
  if safety_result.safety_status in {
    SafetyStatus.CRISIS,
    SafetyStatus.URGENT_DENTAL_OR_MEDICAL,
  }:
    return (
      generate_rule_based_plan(intake, safety_result),
      None,
      RULE_BASED_PROMPT_VERSION,
    )

  if settings.ai_plan_mode != "ai":
    return (
      generate_rule_based_plan(intake, safety_result),
      None,
      RULE_BASED_PROMPT_VERSION,
    )

  try:
    plan_schema = generate_ai_plan(intake, safety_result)
  except AIPlanGenerationError as exc:
    db.add(
      AuditEvent(
        event_type="ai_plan_rejected",
        assessment_id=assessment_id,
        metadata_json={
          "model": settings.openai_model,
          "safety_status": safety_result.safety_status.value,
          "rejection_reason": exc.reason,
          "fallback_used": True,
        },
      ),
    )
    db.add(
      AuditEvent(
        event_type="ai_plan_fallback_used",
        assessment_id=assessment_id,
        metadata_json={
          "model": settings.openai_model,
          "safety_status": safety_result.safety_status.value,
          "rejection_reason": exc.reason,
          "fallback_used": True,
        },
      ),
    )
    return (
      generate_rule_based_plan(intake, safety_result),
      None,
      RULE_BASED_PROMPT_VERSION,
    )

  db.add(
    AuditEvent(
      event_type="ai_plan_created",
      assessment_id=assessment_id,
      metadata_json={
        "model": settings.openai_model,
        "safety_status": plan_schema.safety_status.value,
        "fallback_used": False,
      },
    ),
  )

  return plan_schema, settings.openai_model, AI_PROMPT_VERSION
