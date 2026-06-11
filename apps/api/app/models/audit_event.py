from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any

from sqlalchemy import JSON, DateTime, ForeignKey, String, Uuid, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.assessment import Assessment


class AuditEvent(Base):
  __tablename__ = "audit_events"

  id: Mapped[uuid.UUID] = mapped_column(
    Uuid(as_uuid=True),
    primary_key=True,
    default=uuid.uuid4,
  )
  event_type: Mapped[str] = mapped_column(String, nullable=False)
  assessment_id: Mapped[uuid.UUID | None] = mapped_column(
    Uuid(as_uuid=True),
    ForeignKey("assessments.id", ondelete="SET NULL"),
    nullable=True,
  )
  metadata_json: Mapped[dict[str, Any] | None] = mapped_column(
    JSON,
    nullable=True,
  )
  created_at: Mapped[datetime] = mapped_column(
    DateTime,
    nullable=False,
    server_default=func.now(),
  )

  assessment: Mapped[Assessment | None] = relationship()
