from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import settings


class Base(DeclarativeBase):
  pass


engine: Engine | None = None
SessionLocal = sessionmaker(autoflush=False, autocommit=False)


def get_engine() -> Engine:
  global engine

  if engine is None:
    engine = create_engine(settings.database_url, pool_pre_ping=True)

  return engine


def get_db() -> Generator[Session]:
  SessionLocal.configure(bind=get_engine())
  db = SessionLocal()
  try:
    yield db
  finally:
    db.close()
