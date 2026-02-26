from app.schemes import Goal, Action
from datetime import datetime

_fake_db   : dict[int , Goal]  = {}
_action_db : dict[int, Action] = {}

class GoalService:
    def __init__(self):
        # create first fake data
        first_goal = Goal(
            id=1,
            name="a",
            description="ab",
            color="#FFFFFF",
            date_set="2026-01-15T10:00:00Z",
            user_id=100
        )
        _fake_db[1] = first_goal

    def _get_uniq_id(self):
        return max(_fake_db.keys()) + 1

    def get_goal_id(self, id : int) -> Goal | None:
        if id not in _fake_db: return None
        return _fake_db[id]
    
    def get_goals(self) -> list[Goal]:
        return list(_fake_db.values())
    
    def update_goal(self, id : int, goal : Goal) -> Goal | None:
        if id not in _fake_db: return None
        _fake_db[id] = goal
        return _fake_db[id]
    
    def delete_goal(self, id : int) -> bool:
        if id not in _fake_db: return False
        del _fake_db[id]
        return True
    
    def create_goal(self, goal : Goal):
        new_id = self._get_uniq_id()
        goal.id = new_id
        _fake_db[new_id] = goal

class ActionService:
    def __init__(self):
        # create first fake action
        first_action = Action(
            id=1,
            name="action",
            goal_id=1,
            description="test",
            date="2026-01-15T10:00:00Z",
            user_id=100
        )
        _action_db[1] = first_action

    def _get_uniq_id(self):
        return max(_action_db.keys()) + 1

    def get_action_id(self, id : int) -> Action | None:
        if id not in _action_db: return None
        return _action_db[id]
    
    def get_actions(self, start : datetime, finish : datetime) -> list[Action]:
        # right now i need just check all values from fake database
        # and compare it with start and finish time
        # this O(n) but i think without db its okey rn
        # return actions not sorted !

        actions = []

        for action in _action_db.values():
            if action.date >= start and action.date <= finish:
                actions.append(action) 

        return actions 

    def update_goal(self, id : int, action : Action) -> Action | None:
        if id not in _action_db: return None
        _action_db[id] = action
        return _action_db[id]
    
    def delete_action(self, id : int) -> bool:
        if id not in _action_db: return False
        del _action_db[id]
        return True
    
    def create_goal(self, action : Action):
        new_id = self._get_uniq_id()
        action.id = new_id
        _fake_db[new_id] = action