from app.schemes import Goal

_fake_db : dict[int , Goal] = {}

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