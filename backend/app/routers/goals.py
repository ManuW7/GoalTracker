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
def get_goal(id : int):
    goal = goal_editor.get_goal_id(id)
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found for get")
    return goal

@router.put("/{id}", response_model=Goal)
def put_goal(id : int, goal : Goal):
    edit = goal_editor.update_goal(id, goal)
    if not edit: 
        raise HTTPException(status_code=404, detail="Goal not found for put")
    return edit

@router.delete("/{id}")
def delete_goal(id : int):
    result = goal_editor.delete_goal(id)
    if not result:
        raise HTTPException(status_code=404, detail="Goal not found for delete")
    return

@router.post("/")
def post_goal(goal : Goal):
    if goal.id != -1:
        raise HTTPException(status_code=404, detail="Post goal id not equal -1")
    goal_editor.create_goal(goal)