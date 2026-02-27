from fastapi import APIRouter, HTTPException
from app.services.service import GoalService
from app.schemes import Goal

router = APIRouter(prefix = "/goals")
goal_editor = GoalService()

@router.get("/", response_model=list[Goal])
def get_goals():
    return goal_editor.get_goals()

@router.get("/{id}", response_model=Goal)
def get_goal(id : int):
    return goal_editor.get_goal_id(id)

@router.put("/{id}", response_model=Goal)
def put_goal(id : int, goal : Goal):
    return goal_editor.update_goal(id, goal)

@router.delete("/{id}")
def delete_goal(id : int):
    return goal_editor.delete_goal(id)

@router.post("/")
def post_goal(goal : Goal):
    return goal_editor.create_goal(goal)