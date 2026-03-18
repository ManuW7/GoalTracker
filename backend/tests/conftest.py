import os
import sys
import tempfile
from pathlib import Path

import sqlalchemy
from sqlalchemy import event


BACKEND_DIR = Path(__file__).resolve().parents[1]
TEST_DB_PATH = Path(tempfile.gettempdir()) / "goaltracker_pytest.db"

if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

os.environ["DATABASE_URL"] = f"sqlite:///{TEST_DB_PATH}"
os.environ.setdefault("ENV", "test")


_original_create_engine = sqlalchemy.create_engine


def _patched_create_engine(url, *args, **kwargs):
    if str(url).startswith("sqlite"):
        kwargs.pop("pool_size", None)
        kwargs.pop("max_overflow", None)
        kwargs.pop("pool_timeout", None)
        connect_args = kwargs.setdefault("connect_args", {})
        connect_args.setdefault("check_same_thread", False)
    return _original_create_engine(url, *args, **kwargs)


sqlalchemy.create_engine = _patched_create_engine

import pytest

from app.db.base import Base
from app.db.session import SessionLocal, engine


@event.listens_for(engine, "connect")
def _enable_sqlite_foreign_keys(dbapi_connection, _connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()


@pytest.fixture(autouse=True)
def reset_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    yield

    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def db_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
