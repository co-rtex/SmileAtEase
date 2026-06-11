from fastapi.testclient import TestClient
from sqlalchemy.exc import SQLAlchemyError

from app.database import get_db
from app.main import app


def test_health_check_returns_ok() -> None:
  client = TestClient(app)

  response = client.get("/api/health")

  assert response.status_code == 200
  assert response.json() == {"status": "ok"}


class ReadySession:
  def execute(self, statement):
    return None


class FailingSession:
  def execute(self, statement):
    raise SQLAlchemyError("database unavailable")


def test_readiness_check_returns_ready() -> None:
  def override_get_db():
    yield ReadySession()

  app.dependency_overrides[get_db] = override_get_db
  client = TestClient(app)

  try:
    response = client.get("/api/readiness")
  finally:
    app.dependency_overrides.clear()

  assert response.status_code == 200
  assert response.json() == {"status": "ready", "database": "ok"}


def test_readiness_check_returns_503_when_database_unavailable() -> None:
  def override_get_db():
    yield FailingSession()

  app.dependency_overrides[get_db] = override_get_db
  client = TestClient(app)

  try:
    response = client.get("/api/readiness")
  finally:
    app.dependency_overrides.clear()

  assert response.status_code == 503
  assert response.json() == {
    "detail": {
      "status": "not_ready",
      "database": "unavailable",
    },
  }
