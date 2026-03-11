from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

import app.services.errors as errors

from app.db.storage import GoalStorage, ActionStorage, UserStorage

USER_ID = 100

goal_db   = GoalStorage()
action_db = ActionStorage()
user_db   = UserStorage()

class BaseService:
    def _commit(self, ses: Session) -> None:
        try:
            ses.commit()

        except IntegrityError as exc:
            ses.rollback()
            raise self._map_integrity_error(exc) from exc

        except SQLAlchemyError as exc:
            ses.rollback()
            raise errors.DatabaseError() from exc

        except Exception:
            ses.rollback()
            raise

    def _map_integrity_error(self, exc: IntegrityError) -> Exception:
        pgcode = getattr(exc.orig, "pgcode", None)

        if pgcode == "23503":
            return errors.ForeignKeyViolation()

        if pgcode == "23505":
            return errors.UniqueViolation()

        if pgcode == "23502":
            return errors.NotNullViolation()

        if pgcode == "23514":
            return errors.CheckViolation()

        return errors.DataIntegrityError()