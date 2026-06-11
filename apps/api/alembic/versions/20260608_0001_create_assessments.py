"""create assessments

Revision ID: 20260608_0001
Revises:
Create Date: 2026-06-08 00:00:00.000000
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "20260608_0001"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
  op.create_table(
    "assessments",
    sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
    sa.Column("anonymous_session_id", sa.String(), nullable=False),
    sa.Column("appointment_status", sa.String(), nullable=False),
    sa.Column("visit_type", sa.String(), nullable=False),
    sa.Column("plan_for", sa.String(), nullable=False),
    sa.Column("biggest_worry", sa.String(), nullable=False),
    sa.Column("last_visit", sa.String(), nullable=False),
    sa.Column("bad_experience_level", sa.String(), nullable=False),
    sa.Column("include_bad_experience_note", sa.String(), nullable=True),
    sa.Column("concern_score", sa.Integer(), nullable=False),
    sa.Column(
      "urgent_flag",
      sa.Boolean(),
      nullable=False,
      server_default=sa.text("false"),
    ),
    sa.Column(
      "self_harm_flag",
      sa.Boolean(),
      nullable=False,
      server_default=sa.text("false"),
    ),
    sa.Column(
      "boundary_flag",
      sa.Boolean(),
      nullable=False,
      server_default=sa.text("false"),
    ),
    sa.Column(
      "optional_context_present",
      sa.Boolean(),
      nullable=False,
      server_default=sa.text("false"),
    ),
    sa.Column(
      "created_at",
      sa.DateTime(),
      nullable=False,
      server_default=sa.func.now(),
    ),
    sa.Column("expires_at", sa.DateTime(), nullable=False),
  )

  op.create_table(
    "assessment_worries",
    sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
    sa.Column("assessment_id", postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column("worry_key", sa.String(), nullable=False),
    sa.ForeignKeyConstraint(
      ["assessment_id"],
      ["assessments.id"],
      ondelete="CASCADE",
    ),
  )

  op.create_table(
    "communication_preferences",
    sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
    sa.Column("assessment_id", postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column("preference_key", sa.String(), nullable=False),
    sa.ForeignKeyConstraint(
      ["assessment_id"],
      ["assessments.id"],
      ondelete="CASCADE",
    ),
  )

  op.create_table(
    "coping_preferences",
    sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
    sa.Column("assessment_id", postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column("coping_key", sa.String(), nullable=False),
    sa.ForeignKeyConstraint(
      ["assessment_id"],
      ["assessments.id"],
      ondelete="CASCADE",
    ),
  )

  op.create_table(
    "audit_events",
    sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
    sa.Column("event_type", sa.String(), nullable=False),
    sa.Column("assessment_id", postgresql.UUID(as_uuid=True), nullable=True),
    sa.Column("metadata_json", postgresql.JSONB(), nullable=True),
    sa.Column(
      "created_at",
      sa.DateTime(),
      nullable=False,
      server_default=sa.func.now(),
    ),
    sa.ForeignKeyConstraint(
      ["assessment_id"],
      ["assessments.id"],
      ondelete="SET NULL",
    ),
  )


def downgrade() -> None:
  op.drop_table("audit_events")
  op.drop_table("coping_preferences")
  op.drop_table("communication_preferences")
  op.drop_table("assessment_worries")
  op.drop_table("assessments")
