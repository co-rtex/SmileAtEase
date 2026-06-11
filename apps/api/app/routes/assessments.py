from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.assessment import (
  CreateAssessmentRequest,
  CreateAssessmentResponse,
)
from app.services.assessment_persistence import create_assessment_from_intake

router = APIRouter(tags=["assessments"])


@router.post("/assessments", response_model=CreateAssessmentResponse)
def create_assessment(
  payload: CreateAssessmentRequest,
  db: Session = Depends(get_db),
) -> CreateAssessmentResponse:
  assessment, safety_result = create_assessment_from_intake(
    db=db,
    intake=payload.intake,
    anonymous_session_id=payload.anonymous_session_id,
  )
  db.commit()
  db.refresh(assessment)

  return CreateAssessmentResponse(
    assessment_id=assessment.id,
    concern_score=assessment.concern_score,
    safety_status=safety_result.safety_status.value,
    urgent_flag=assessment.urgent_flag,
    self_harm_flag=assessment.self_harm_flag,
    boundary_flag=assessment.boundary_flag,
  )
