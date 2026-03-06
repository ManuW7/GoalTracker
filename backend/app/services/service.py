from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

from app.schemes import Goal, Action
from app.models.goal import Goal as GoalORM
from app.models.action import Action as ActionORM
import app.services.errors as errors

from app.db.storage import GoalStorage, ActionStorage

USER_ID = 100

goal_db   = GoalStorage()
action_db = ActionStorage()

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

class GoalService(BaseService):
    def _ORM_to_schema_conv(self, goalORM : GoalORM) -> Goal:
        goal = Goal(
            id=goalORM.id,
            name=goalORM.name,
            description=goalORM.description,
            color=goalORM.color,
            date_set=goalORM.date_set,
            user_id=goalORM.user_id
        )
        return goal
    
    def _schema_to_ORM_conv(self, goal : Goal) -> GoalORM:
        goalORM = GoalORM(
            name=goal.name,
            description=goal.description,
            color=goal.color,
            date_set=goal.date_set,
            user_id=goal.user_id
        )
        return goalORM
    
    def _is_goal_valid(self, goal : Goal) -> bool:
        offset = goal.date_set.utcoffset()
        if goal.date_set.tzinfo is None or offset is None or offset != timedelta(0):
            raise errors.InvalidTimezone()
        
        now = datetime.now(timezone.utc)
        if goal.date_set <= now:
            raise errors.DateInPast()
        
        return True

    def get_goal_id(self, id : int, ses: Session) -> Goal:
        goal = goal_db.get(id, ses)
        if goal is None:
            raise errors.IdNotFound()
        return self._ORM_to_schema_conv(goal)
    
    def get_goals(self, ses: Session) -> list[Goal]:
        # !!! User id rn is 100 !!! #
        goals = goal_db.get_all_goals(USER_ID, ses)
        goals = [self._ORM_to_schema_conv(i) for i in goals]
        return goals
    
    def update_goal(self, id : int, goal : Goal, ses: Session) -> Goal:
        goalORM = goal_db.get(id, ses)
        if goalORM is None:
            raise errors.IdNotFound()
        self._is_goal_valid(goal)

        goalORM.name=goal.name
        goalORM.description=goal.description
        goalORM.color=goal.color
        goalORM.date_set=goal.date_set
        
        self._commit(ses)
        goal.id = id
        return goal
    
    def delete_goal(self, id : int, ses: Session) -> Goal:
        res = goal_db.delete(id, ses)
        if res is None:
            raise errors.IdNotFound()
        self._commit(ses)
        return self._ORM_to_schema_conv(res)
    
    def create_goal(self, goal : Goal, ses: Session):
        self._is_goal_valid(goal)
        try:
            res = goal_db.create(self._schema_to_ORM_conv(goal), ses)
        except IntegrityError:
            ses.rollback()
            raise errors.UniqueViolation()

        self._commit(ses)

        return self._ORM_to_schema_conv(res)

# ----------- Action Service --------------

class ActionService(BaseService):
    def _ORM_to_schema_conv(self, actionORM : ActionORM) -> Action:
        action = Action(
            id=actionORM.id,
            name=actionORM.name,
            description=actionORM.description,
            date=actionORM.date,
            goal_id=actionORM.goal_id,
            user_id=actionORM.goal.user_id
        )
        return action
    
    def _schema_to_ORM_conv(self, action : Action) -> ActionORM:
        actionORM = ActionORM(
            #id=action.id, # dont need
            name=action.name,
            description=action.description,
            date=action.date,
            goal_id=action.goal_id
        )
        return actionORM
    
    def _is_action_valid(self, action : Action, ses : Session) -> bool:
        if action.date.tzinfo is None or action.date.utcoffset() != timedelta(0):
            raise errors.InvalidTimezone()
        
        now = datetime.now(timezone.utc)
        if action.date >= now:
            raise errors.DateInFuture()
        
        goal = goal_db.get(action.goal_id, ses)
        if goal is None:
            raise errors.GoalNotFound()
        
        return True

    def get_action_id(self, id : int, ses: Session) -> Action:
        action = action_db.get(id, ses)
        if action is None:
            raise errors.IdNotFound()
        return self._ORM_to_schema_conv(action)
    
    def get_actions(self, start : datetime, finish : datetime, ses: Session) -> list[Action]:
        actions = action_db.get_actions(USER_ID, start, finish, ses)
        actions = [self._ORM_to_schema_conv(i) for i in actions]
        return actions 

    def update_action(self, id : int, action : Action, ses: Session) -> Action:
        actionORM = action_db.get(id, ses)
        if actionORM is None:
            raise errors.IdNotFound()
        self._is_action_valid(action, ses)

        actionORM.name=action.name
        actionORM.description=action.description
        actionORM.date=action.date
        actionORM.goal_id=action.goal_id

        self._commit(ses)
        action.id = id
        return action
    
    def delete_action(self, id : int, ses: Session) -> Action:
        action = action_db.delete(id, ses)
        if action is None:
            raise errors.IdNotFound()
        self._commit(ses)
        return self._ORM_to_schema_conv(action)
    
    def create_action(self, action : Action, ses: Session):
        self._is_action_valid(action, ses)
        try:
            res = action_db.create(self._schema_to_ORM_conv(action), ses)
        except IntegrityError:
            ses.rollback()
            raise errors.UniqueViolation()
        self._commit(ses)
        return self._ORM_to_schema_conv(res)