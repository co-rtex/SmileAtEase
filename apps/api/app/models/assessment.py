from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Uuid, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Assessment(Base):
  __tablename__ = "assessments"

  id: Mapped[uuid.UUID] = mapped_column(
    Uuid(as_uuid=True),
    primary_key=True,
    default=uuid.uuid4,
  )
  anonymous_session_id: Mapped[str] = mapped_column(String, nullable=False)
  appointment_status: Mapped[str] = mapped_column(String, nullable=False)
  visit_type: Mapped[str] = mapped_column(String, nullable=False)
  plan_for: Mapped[str] = mapped_column(String, nullable=False)
  biggest_worry: Mapped[str] = mapped_column(String, nullable=False)
  last_visit: Mapped[str] = mapped_column(String, nullable=False)
  bad_experience_level: Mapped[str] = mapped_column(String, nullable=False)
  include_bad_experience_note: Mapped[str | None] = mapped_column(
    String,
    nullable=True,
  )
  concern_score: Mapped[int] = mapped_column(Integer, nullable=False)
  urgent_flag: Mapped[bool] = mapped_column(
    Boolean,
    nullable=False,
    default=False,
  )
  self_harm_flag: Mapped[bool] = mapped_column(
    Boolean,
    nullable=False,
    default=False,
  )
  boundary_flag: Mapped[bool] = mapped_column(
    Boolean,
    nullable=False,
    default=False,
  )
  optional_context_present: Mapped[bool] = mapped_column(
    Boolean,
    nullable=False,
    default=False,
  )
  created_at: Mapped[datetime] = mapped_column(
    DateTime,
    nullable=False,
    server_default=func.now(),
  )
  expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)

  worries: Mapped[list[AssessmentWorry]] = relationship(
    back_populates="assessment",
    cascade="all, delete-orphan",
  )
  communication_preferences: Mapped[list[CommunicationPreference]] = (
    relationship(
      back_populates="assessment",
      cascade="all, delete-orphan",
    )
  )
  coping_preferences: Mapped[list[CopingPreference]] = relationship(
    back_populates="assessment",
    cascade="all, delete-orphan",
  )
  plans: Mapped[list["Plan"]] = relationship(
    "Plan",
    back_populates="assessment",
    cascade="all, delete-orphan",
  )


class AssessmentWorry(Base):
  __tablename__ = "assessment_worries"

  id: Mapped[uuid.UUID] = mapped_column(
    Uuid(as_uuid=True),
    primary_key=True,
    default=uuid.uuid4,
  )
  assessment_id: Mapped[uuid.UUID] = mapped_column(
    Uuid(as_uuid=True),
    ForeignKey("assessments.id", ondelete="CASCADE"),
    nullable=False,
  )
  worry_key: Mapped[str] = mapped_column(String, nullable=False)

  assessment: Mapped[Assessment] = relationship(back_populates="worries")


class CommunicationPreference(Base):
  __tablename__ = "communication_preferences"

  id: Mapped[uuid.UUID] = mapped_column(
    Uuid(as_uuid=True),
    primary_key=True,
    default=uuid.uuid4,
  )
  assessment_id: Mapped[uuid.UUID] = mapped_column(
    Uuid(as_uuid=True),
    ForeignKey("assessments.id", ondelete="CASCADE"),
    nullable=False,
  )
  preference_key: Mapped[str] = mapped_column(String, nullable=False)

  assessment: Mapped[Assessment] = relationship(
    back_populates="communication_preferences",
  )


class CopingPreference(Base):
  __tablename__ = "coping_preferences"

  id: Mapped[uuid.UUID] = mapped_column(
    Uuid(as_uuid=True),
    primary_key=True,
    default=uuid.uuid4,
  )
  assessment_id: Mapped[uuid.UUID] = mapped_column(
    Uuid(as_uuid=True),
    ForeignKey("assessments.id", ondelete="CASCADE"),
    nullable=False,
  )
  coping_key: Mapped[str] = mapped_column(String, nullable=False)

  assessment: Mapped[Assessment] = relationship(
    back_populates="coping_preferences",
  )
