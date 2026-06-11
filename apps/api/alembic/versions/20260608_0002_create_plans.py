"""create plans

Revision ID: 20260608_0002
Revises: 20260608_0001
Create Date: 2026-06-08 00:00:00.000000
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "20260608_0002"
down_revision: str | None = "20260608_0001"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
  op.create_table(
    "plans",
    sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
    sa.Column("assessment_id", postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column("plan_json", postgresql.JSONB(), nullable=False),
    sa.Column("safety_status", sa.String(), nullable=False),
    sa.Column("model_used", sa.String(), nullable=True),
    sa.Column(
      "prompt_version",
      sa.String(),
      nullable=False,
      server_default="rule_based_v1",
    ),
    sa.Column(
      "created_at",
      sa.DateTime(),
      nullable=False,
      server_default=sa.func.now(),
    ),
    sa.Column("expires_at", sa.DateTime(), nullable=False),
    sa.Column("deleted_at", sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(
      ["assessment_id"],
      ["assessments.id"],
      ondelete="CASCADE",
    ),
  )


def downgrade() -> None:
  op.drop_table("plans")
