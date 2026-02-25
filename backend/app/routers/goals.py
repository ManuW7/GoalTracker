from fastapi import APIRouter, HTTPException
from app.services.service import GoalService
from app.schemes import Goal

router = APIRouter(prefix = "/goals")
goal_editor = GoalService()

@router.get("/", response_model=list[Goal])
def get_goals():
    goals = goal_editor.get_goals()
    return goals

@router.get("/{id}", response_model=Goal)
def get_goal_id(id : int):
    goal = goal_editor.get_goal_id(id)
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    return goal
