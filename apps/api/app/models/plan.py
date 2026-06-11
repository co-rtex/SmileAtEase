from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any

from sqlalchemy import JSON, DateTime, ForeignKey, String, Uuid, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Plan(Base):
  __tablename__ = "plans"

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
  plan_json: Mapped[dict[str, Any]] = mapped_column(JSON, nullable=False)
  safety_status: Mapped[str] = mapped_column(String, nullable=False)
  model_used: Mapped[str | None] = mapped_column(String, nullable=True)
  prompt_version: Mapped[str] = mapped_column(
    String,
    nullable=False,
    default="rule_based_v1",
  )
  created_at: Mapped[datetime] = mapped_column(
    DateTime,
    nullable=False,
    server_default=func.now(),
  )
  expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
  deleted_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

  assessment: Mapped["Assessment"] = relationship(
    "Assessment",
    back_populates="plans",
  )
