from __future__ import annotations

from enum import Enum
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, Field, computed_field, model_validator


class AppointmentStatus(str, Enum):
  WITHIN_WEEK = "within_week"
  WITHIN_MONTH = "within_month"
  LATER_THAN_MONTH = "later_than_month"
  NOT_SCHEDULED = "not_scheduled"
  THINKING_ABOUT_SCHEDULING = "thinking_about_scheduling"


class VisitType(str, Enum):
  CLEANING_CHECKUP = "cleaning_checkup"
  FIRST_VISIT_LONG_TIME = "first_visit_long_time"
  FILLING = "filling"
  URGENT_CONCERN = "urgent_concern"
  EXTRACTION_CONSULT = "extraction_consult"
  DEEP_CLEANING = "deep_cleaning"
  NOT_SURE = "not_sure"
  OTHER = "other"


class PlanFor(str, Enum):
  ME = "me"
  CHILD = "child"
  FAMILY_MEMBER = "family_member"
  SOMEONE_I_SUPPORT = "someone_i_support"


class WorryKey(str, Enum):
  PAIN = "pain"
  NEEDLES = "needles"
  DRILL_SOUNDS = "drill_sounds"
  EMBARRASSMENT = "embarrassment"
  JUDGMENT = "judgment"
  NOT_KNOWING = "not_knowing"
  COST = "cost"
  GAGGING = "gagging"
  LOSS_OF_CONTROL = "loss_of_control"
  BAD_PAST_EXPERIENCE = "bad_past_experience"
  SENSORY = "sensory"
  MOUTH_OPEN = "mouth_open"
  BAD_NEWS = "bad_news"
  COMMUNICATION = "communication"
  OTHER = "other"


class LastVisit(str, Enum):
  WITHIN_6_MONTHS = "within_6_months"
  SIX_TO_TWELVE_MONTHS = "six_to_twelve_months"
  ONE_TO_TWO_YEARS = "one_to_two_years"
  MORE_THAN_TWO_YEARS = "more_than_two_years"
  DO_NOT_REMEMBER = "do_not_remember"
  NEVER = "never"


class BadExperienceLevel(str, Enum):
  NO = "no"
  MILDLY_UPSETTING = "mildly_upsetting"
  VERY_UPSETTING = "very_upsetting"
  PREFER_NOT_TO_SAY = "prefer_not_to_say"


class IncludeBadExperienceNote(str, Enum):
  YES_GENTLE_NOTE = "yes_gentle_note"
  NO_KEEP_PRIVATE = "no_keep_private"
  ONLY_EXTRA_COMMUNICATION = "only_extra_communication"


class CommunicationPreference(str, Enum):
  EXPLAIN_EACH_STEP = "explain_each_step"
  ASK_BEFORE_STARTING = "ask_before_starting"
  CHECK_IN_DURING_VISIT = "check_in_during_visit"
  HAND_SIGNAL = "hand_signal"
  SHORT_BREAKS = "short_breaks"
  KNOW_SOUNDS_SENSATIONS = "know_sounds_sensations"
  COST_BEFORE_TREATMENT = "cost_before_treatment"
  SUPPORT_PERSON = "support_person"
  FEWER_DETAILS = "fewer_details"
  DETAILED_EXPLANATIONS = "detailed_explanations"


class CommunicationStyle(str, Enum):
  CALM_DIRECT = "calm_direct"
  VERY_DETAILED = "very_detailed"
  SIMPLE_BRIEF = "simple_brief"
  ASK_BEFORE_DETAILS = "ask_before_details"


class CopingPreference(str, Enum):
  HEADPHONES = "headphones"
  COUNTING = "counting"
  STRESS_OBJECT = "stress_object"
  BREAKS = "breaks"
  SUPPORT_PERSON = "support_person"
  CLOSE_EYES = "close_eyes"


class UrgentSymptom(str, Enum):
  TROUBLE_BREATHING_SWALLOWING = "trouble_breathing_swallowing"
  RAPID_SWELLING = "rapid_swelling"
  FEVER_WITH_DENTAL_PAIN = "fever_with_dental_pain"
  UNCONTROLLED_BLEEDING = "uncontrolled_bleeding"
  SEVERE_INJURY = "severe_injury"
  NONE = "none"


class SelfHarmRisk(str, Enum):
  NO = "no"
  YES = "yes"
  PREFER_NOT_TO_SAY = "prefer_not_to_say"


class IntakeSchema(BaseModel):
  appointment_status: AppointmentStatus
  visit_type: VisitType
  plan_for: PlanFor
  worries: list[WorryKey] = Field(min_length=1)
  biggest_worry: WorryKey
  last_visit: LastVisit
  bad_experience_level: BadExperienceLevel
  include_bad_experience_note: IncludeBadExperienceNote | None
  communication_preferences: list[CommunicationPreference] = Field(
    min_length=1,
  )
  communication_style: CommunicationStyle
  coping_preferences: list[CopingPreference] = Field(default_factory=list)
  include_calming_script: bool
  optional_context: str | None = Field(default=None, max_length=700)
  urgent_symptoms: list[UrgentSymptom] = Field(min_length=1)
  self_harm_risk: SelfHarmRisk
  disclaimer_acknowledged: Literal[True]

  @computed_field
  @property
  def concern_score(self) -> int:
    score = len(self.worries)

    if self.bad_experience_level == BadExperienceLevel.VERY_UPSETTING:
      score += 2
    elif self.bad_experience_level == BadExperienceLevel.MILDLY_UPSETTING:
      score += 1

    if self.last_visit in {LastVisit.MORE_THAN_TWO_YEARS, LastVisit.NEVER}:
      score += 2

    if self.visit_type == VisitType.FIRST_VISIT_LONG_TIME:
      score += 1

    weighted_worries = {
      WorryKey.PAIN,
      WorryKey.NEEDLES,
      WorryKey.EMBARRASSMENT,
      WorryKey.JUDGMENT,
      WorryKey.LOSS_OF_CONTROL,
      WorryKey.BAD_PAST_EXPERIENCE,
      WorryKey.GAGGING,
      WorryKey.COST,
      WorryKey.COMMUNICATION,
    }
    score += len(set(self.worries).intersection(weighted_worries))

    return min(score, 20)

  @model_validator(mode="after")
  def validate_selected_values(self) -> IntakeSchema:
    if self.biggest_worry not in self.worries:
      raise ValueError("biggest_worry must be one of the selected worries")

    if (
      UrgentSymptom.NONE in self.urgent_symptoms
      and len(self.urgent_symptoms) > 1
    ):
      raise ValueError(
        "urgent_symptoms cannot include none with other symptoms",
      )

    return self


class CreateAssessmentRequest(BaseModel):
  intake: IntakeSchema
  anonymous_session_id: str | None = None


class CreateAssessmentResponse(BaseModel):
  assessment_id: UUID
  concern_score: int
  safety_status: str
  urgent_flag: bool
  self_harm_flag: bool
  boundary_flag: bool
