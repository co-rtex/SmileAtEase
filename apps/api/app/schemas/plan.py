from __future__ import annotations

from enum import Enum
from uuid import UUID

from pydantic import BaseModel

from app.schemas.assessment import IntakeSchema


class SafetyStatus(str, Enum):
  STANDARD = "standard"
  URGENT_DENTAL_OR_MEDICAL = "urgent_dental_or_medical"
  CRISIS = "crisis"
  BOUNDARY = "boundary"
  FALLBACK = "fallback"


class ComfortCardSchema(BaseModel):
  intro: str
  my_concerns: list[str]
  what_helps_me: list[str]
  pause_signal: str
  communication_preference: str


class PlanSchema(BaseModel):
  safety_status: SafetyStatus
  title: str
  gentle_summary: str
  main_concerns: list[str]
  before_visit: list[str]
  when_you_arrive: list[str]
  during_visit: list[str]
  if_overwhelmed: list[str]
  questions_to_ask: list[str]
  comfort_card: ComfortCardSchema
  important_reminder: str
  blocked_or_redirect_message: str | None


class GeneratePlanRequest(BaseModel):
  intake: IntakeSchema
  anonymous_session_id: str | None = None


class GeneratePlanResponse(BaseModel):
  plan_id: UUID
  assessment_id: UUID
  safety_status: SafetyStatus
  plan: PlanSchema


class GetPlanResponse(BaseModel):
  plan_id: UUID
  assessment_id: UUID
  safety_status: SafetyStatus
  plan: PlanSchema


class DeletePlanResponse(BaseModel):
  deleted: bool
