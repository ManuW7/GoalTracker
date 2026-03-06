from sqlalchemy.orm import Session
from sqlalchemy import select
from datetime import datetime

from app.models.goal import Goal
from app.models.action import Action
from app.models.user import User

class GoalStorage:
    def get(self, id : int, session : Session) -> Goal | None:
        goal = session.get(Goal, id)
        return goal
    
    def create(self, goal : Goal, session : Session) -> Goal:
        session.add(goal)
        session.flush()
        # session.refresh(goal)
        return goal
    
    def delete(self, id : int, session : Session) -> Goal | None:
        goal = self.get(id, session)

        if goal is None: return None
        
        session.delete(goal)
        return goal

    def get_all_goals(self, user_id : int, session : Session) -> list[Goal]:
        stmt = select(Goal).where(Goal.user_id == user_id)
        result = session.execute(stmt).scalars().all()
        return result
    

class ActionStorage:
    def get(self, id : int, session : Session) -> Action | None:
        action = session.get(Action, id)
        return action
    
    def create(self, action : Action, session : Session) -> Action:
        session.add(action)
        session.flush()
        # session.refresh(goal)
        return action
    
    def delete(self, id : int, session : Session) -> Action | None:
        action = self.get(id, session)

        if action is None: return None
        
        session.delete(action)
        return action

    def get_actions(self, user_id : int, start : datetime, finish : datetime, 
                    session : Session) -> list[Action]:
        stmt = select(Action).join(Goal).where(
                    Goal.user_id == user_id,
                    Action.date.between(start, finish))
        result = session.execute(stmt).scalars().all()
        return result