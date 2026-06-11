from __future__ import annotations

import re
from enum import Enum

from pydantic import BaseModel, Field

from app.schemas.assessment import IntakeSchema, SelfHarmRisk, UrgentSymptom
from app.services.sanitizer import sanitize_optional_context

BOUNDARY_MESSAGE = (
  "This tool cannot recommend medication, sedation, diagnosis, or treatment. "
  "Ask your dentist, physician, or qualified professional what options are "
  "safe for you."
)
CRISIS_RESPONSE_TEXT = (
  "If you might hurt yourself or cannot stay safe, call or text 988 in the "
  "U.S. and Canada, or contact local emergency services now."
)
URGENT_RESPONSE_TEXT = (
  "Your answers include symptoms that may need urgent professional care. "
  "Contact a dentist, medical professional, or emergency service now. If you "
  "are having trouble breathing or swallowing, seek emergency medical care "
  "immediately."
)

CRISIS_PHRASES = (
  "kill myself",
  "suicide",
  "end my life",
  "hurt myself",
  "can't stay safe",
  "cannot stay safe",
  "want to die",
)

BOUNDARY_PATTERNS = (
  ("medication", re.compile(r"\bmedicat(?:e|ed|ing|ion|ions)\b")),
  ("sedation", re.compile(r"\bsedat(?:e|ed|ing|ion)\b")),
  ("dosage", re.compile(r"\bdos(?:e|age|ing)\b")),
  ("nitrous", re.compile(r"\bnitrous\b")),
  ("anesthesia_recommendation", re.compile(r"\ban(?:a)?esthesia\b")),
  ("diagnosis", re.compile(r"\bdiagnos(?:e|ed|es|ing|is)\b")),
  ("root_canal_decision", re.compile(r"\broot canal\b")),
  (
    "extraction_decision",
    re.compile(r"\bextract(?:ed|ing|ion|ions)?\b|\bpull(?:ed|ing)? tooth\b"),
  ),
  ("antibiotics", re.compile(r"\bantibiotic(?:s)?\b")),
  (
    "painkiller_instructions",
    re.compile(r"\bpainkiller(?:s)?\b|\bpain medicine\b|\bpain medication\b"),
  ),
)


class SafetyStatus(str, Enum):
  STANDARD = "standard"
  URGENT_DENTAL_OR_MEDICAL = "urgent_dental_or_medical"
  CRISIS = "crisis"
  BOUNDARY = "boundary"


class SafetyResult(BaseModel):
  safety_status: SafetyStatus
  reasons: list[str] = Field(default_factory=list)
  boundary_message: str | None = None


def evaluate_safety(intake: IntakeSchema) -> SafetyResult:
  optional_context = sanitize_optional_context(intake.optional_context) or ""
  normalized_context = optional_context.lower()

  crisis_reasons = _crisis_reasons(intake, normalized_context)
  if crisis_reasons:
    return SafetyResult(
      safety_status=SafetyStatus.CRISIS,
      reasons=crisis_reasons,
    )

  urgent_reasons = _urgent_reasons(intake)
  if urgent_reasons:
    return SafetyResult(
      safety_status=SafetyStatus.URGENT_DENTAL_OR_MEDICAL,
      reasons=urgent_reasons,
    )

  boundary_reasons = _boundary_reasons(normalized_context)
  if boundary_reasons:
    return SafetyResult(
      safety_status=SafetyStatus.BOUNDARY,
      reasons=boundary_reasons,
      boundary_message=build_boundary_message(),
    )

  return SafetyResult(safety_status=SafetyStatus.STANDARD)


def build_crisis_response() -> str:
  return CRISIS_RESPONSE_TEXT


def build_urgent_response() -> str:
  return URGENT_RESPONSE_TEXT


def build_boundary_message() -> str:
  return BOUNDARY_MESSAGE


def _crisis_reasons(
  intake: IntakeSchema,
  normalized_context: str,
) -> list[str]:
  reasons: list[str] = []

  if intake.self_harm_risk == SelfHarmRisk.YES:
    reasons.append("self_harm_risk_yes")

  for phrase in CRISIS_PHRASES:
    if phrase in normalized_context:
      reasons.append(f"self_harm_text:{phrase}")

  return reasons


def _urgent_reasons(intake: IntakeSchema) -> list[str]:
  return [
    f"urgent_symptom:{symptom.value}"
    for symptom in intake.urgent_symptoms
    if symptom != UrgentSymptom.NONE
  ]


def _boundary_reasons(normalized_context: str) -> list[str]:
  return [
    f"boundary:{reason}"
    for reason, pattern in BOUNDARY_PATTERNS
    if pattern.search(normalized_context)
  ]
