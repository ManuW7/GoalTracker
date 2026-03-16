from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

from app.schemes import GoalCreate, GoalUpdate, GoalResponse
from app.schemes import ActionCreate, ActionUpdate, ActionResponse
from app.models.goal import Goal as GoalORM
from app.models.action import Action as ActionORM
import app.services.errors as errors
from app.services.base import BaseService, goal_db, action_db

class GoalService(BaseService):
    # TODO : add current_count, streak and is_failed to GoalResponse and calculate them
    def _ORM_to_GoalResponse(self, goalORM : GoalORM, session : Session) -> GoalResponse:
        current, streak, is_failed = self._get_analytics(goalORM.id, session)
        goal = GoalResponse(
            id=goalORM.id,
            name=goalORM.name,
            description=goalORM.description,
            color=goalORM.color,

            date_set=goalORM.date_set,
            deadline=goalORM.deadline,
            everyday=goalORM.everyday,

            target_count=goalORM.target_count,
            current_count=current,

            streak=streak,
            is_failed=is_failed,
        )
        return goal
    
    def _GoalCreate_to_ORM_conv(self, goal : GoalCreate, user_id : int) -> GoalORM:
        delta_days = (goal.deadline.date() - goal.date_set.date()).days + 1 if goal.deadline is not None else None
        # +1 because user can do action on the day of deadline and on the day of date_set
        goalORM = GoalORM(
            name=goal.name,
            description=goal.description,
            color=goal.color,
            date_set=goal.date_set,
            deadline=goal.deadline,
            everyday=goal.everyday,

            target_count=goal.target_count if not goal.everyday else delta_days, 
            # if goal is everyday, then target_count should be 
            # equal to number of days between date_set and deadline 

            user_id=user_id
        )
        return goalORM
    
    def _is_goal_valid(self, goal) -> bool:
        offset = goal.date_set.utcoffset()
        if goal.date_set.tzinfo is None or offset is None or offset != timedelta(0):
            raise errors.InvalidTimezone()
        
        now = datetime.now(timezone.utc)
        eps = timedelta(seconds=60) # to avoid problems with time of request processing
        if goal.deadline is not None:
            offset = goal.deadline.utcoffset()
            if goal.deadline.tzinfo is None or offset is None or offset != timedelta(0):
                raise errors.InvalidTimezone()
            if goal.deadline.date() < goal.date_set.date():
                raise errors.DeadlineBeforeDateSet()
            
        if goal.everyday and goal.deadline is None:
            raise errors.EverydayGoalWithoutDeadline()
        
        return True
    
    def _get_analytics(self, goal_id : int, ses : Session) -> tuple[int, int, bool]:
        goal = goal_db.get(goal_id, ses)
        if goal is None:
            raise errors.GoalNotFound()
        
        start_day = goal.date_set.date()
        today = datetime.now(timezone.utc).date()
        finish_day = today if goal.deadline is None else min(today, goal.deadline.date())
        total_days = (finish_day - start_day).days + 1

        actions = action_db.get_all_actions(goal_id, ses)
        actions_dates = dict() # date -> count of actions on this date
        for i in actions:
            date = i.date.date()
            actions_dates[date] = actions_dates.get(date, 0) + 1

        current_count = sum([1 for i in range(total_days) 
                                if actions_dates.get(
                                    start_day + timedelta(days=i), 0) >= 1])
        
        streak = 0
        for i in range(total_days):
            if actions_dates.get(finish_day - timedelta(days=i), 0) >= 1:
                streak += 1
            else:
                break
        
        is_failed = None
        if goal.everyday:
            is_failed = False
            if streak != current_count:
                is_failed = True

        return current_count, streak, is_failed

    def get_goal_id(self, id : int, user_id : int, ses: Session) -> GoalResponse:
        goal = goal_db.get(id, ses)
        if goal is None:
            raise errors.IdNotFound()
        if goal.user_id != user_id:
            raise errors.PermissionDenied()
        return self._ORM_to_GoalResponse(goal, ses)
    
    # TODO : add check for roles when they are implemented
    def get_goals(self, user_id : int, ses: Session) -> list[GoalResponse]:
        goals = goal_db.get_all_goals(user_id, ses)
        goals = [self._ORM_to_GoalResponse(i, ses) for i in goals]
        return goals
    
    def update_goal(self, id : int, goal : GoalUpdate, 
                    user_id : int, ses: Session) -> GoalResponse:
        goalORM = goal_db.get(id, ses)
        if goalORM is None:
            raise errors.IdNotFound()
        if goalORM.user_id != user_id:
            raise errors.PermissionDenied()
        self._is_goal_valid(goal)

        goalORM.name=goal.name
        goalORM.description=goal.description
        goalORM.color=goal.color
        goalORM.date_set=goal.date_set
        goalORM.deadline=goal.deadline
        goalORM.everyday=goal.everyday
        goalORM.target_count=goal.target_count
        
        self._commit(ses)
        goal.id = id
        return self._ORM_to_GoalResponse(goalORM, ses)
    
    def delete_goal(self, id : int, user_id : int, ses: Session) -> GoalResponse:
        res = goal_db.get(id, ses)
        if res is None:
            raise errors.IdNotFound()
        if res.user_id != user_id:
            raise errors.PermissionDenied()
        res = self._ORM_to_GoalResponse(res, ses)
        goal_db.delete(id, ses)
        self._commit(ses)
        return res
    
    def create_goal(self, goal : GoalCreate, 
                    user_id : int, ses: Session) -> GoalResponse:
        self._is_goal_valid(goal)
        try:
            res = goal_db.create(self._GoalCreate_to_ORM_conv(goal, user_id), ses)
        except IntegrityError:
            ses.rollback()
            raise errors.UniqueViolation()

        self._commit(ses)

        return self._ORM_to_GoalResponse(res, ses)

# ----------- Action Service --------------

class ActionService(BaseService):
    def _ORM_to_ActionResponse(self, actionORM : ActionORM) -> ActionResponse:
        action = ActionResponse(
            id=actionORM.id,
            name=actionORM.name,
            description=actionORM.description,
            date=actionORM.date,
            goal_id=actionORM.goal_id
        )
        return action
    
    def _ActionCreate_to_ORM_conv(self, action : ActionCreate) -> ActionORM:
        actionORM = ActionORM(
            name=action.name,
            description=action.description,
            date=action.date,
            goal_id=action.goal_id
        )
        return actionORM
    
    def _is_action_valid(self, action, ses : Session) -> bool:
        if action.date.tzinfo is None or action.date.utcoffset() != timedelta(0):
            raise errors.InvalidTimezone()
        
        now = datetime.now(timezone.utc)
        eps = timedelta(seconds=60)
        if action.date >= now + eps:
            raise errors.DateInFuture()
        
        goal = goal_db.get(action.goal_id, ses)
        if goal is None:
            raise errors.GoalNotFound()
        
        if action.date.date() < goal.date_set.date():
            raise errors.ActionBeforeGoal()
        
        if goal.deadline is not None and action.date.date() > goal.deadline.date():
            raise errors.ActionAfterDeadline()
        
        return True

    def get_action_id(self, id : int, user_id : int, ses: Session) -> ActionResponse:
        action = action_db.get(id, ses)
        if action is None:
            raise errors.IdNotFound()
        if action.goal.user_id != user_id:
            raise errors.PermissionDenied()
        return self._ORM_to_ActionResponse(action)
    
    def get_actions(self, start : datetime, finish : datetime, 
                    user_id : int, ses: Session) -> list[ActionResponse]:
        if start.tzinfo is None or start.utcoffset() != timedelta(0):
            raise errors.InvalidTimezone()
        if finish.tzinfo is None or finish.utcoffset() != timedelta(0):
            raise errors.InvalidTimezone()
        if start >= finish:
            raise errors.InvalidInterval()
        actions = action_db.get_actions(user_id, start, finish, ses)
        actions = [self._ORM_to_ActionResponse(i) for i in actions]
        return actions 

    def update_action(self, id : int, action : ActionUpdate, 
                      user_id : int, ses: Session) -> ActionResponse:
        actionORM = action_db.get(id, ses)
        if actionORM is None:
            raise errors.IdNotFound()
        if actionORM.goal.user_id != user_id:
            raise errors.PermissionDenied()

        self._is_action_valid(action, ses)
        new_goal = goal_db.get(action.goal_id, ses)
        if new_goal.user_id != user_id:
            raise errors.PermissionDenied()

        actionORM.name=action.name
        actionORM.description=action.description
        actionORM.date=action.date
        actionORM.goal_id=action.goal_id

        self._commit(ses)
        return self._ORM_to_ActionResponse(actionORM)

    def delete_action(self, id : int, user_id : int, ses: Session) -> ActionResponse:
        action = action_db.get(id, ses)
        if action is None:
            raise errors.IdNotFound()
        if action.goal.user_id != user_id:
            raise errors.PermissionDenied()
        res = self._ORM_to_ActionResponse(action)
        action_db.delete(id, ses)
        self._commit(ses)
        return res
    
    def create_action(self, action : ActionCreate, user_id : int, ses: Session) -> ActionResponse:
        self._is_action_valid(action, ses)
        rel_goal = goal_db.get(action.goal_id, ses)
        if rel_goal.user_id != user_id:
            raise errors.PermissionDenied()
        try:
            res = action_db.create(self._ActionCreate_to_ORM_conv(action), ses)
        except IntegrityError:
            ses.rollback()
            raise errors.UniqueViolation()
        
        self._commit(ses)
        return self._ORM_to_ActionResponse(res)