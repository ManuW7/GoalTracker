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
            date_set="2026-02-02",
            user_id=100
        )
        _fake_db[1] = first_goal

    def get_goal_id(self, id : int) -> Goal | None:
        if id not in _fake_db: return None
        return _fake_db[id]
    
    def get_goals(self) -> list[Goal]:
        return list(_fake_db.values())