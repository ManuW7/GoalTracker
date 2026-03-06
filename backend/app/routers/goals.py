from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from app.services.service import GoalService
from app.schemes import Goal
from app.db.session import get_db

router = APIRouter(prefix = "/goals")
goal_editor = GoalService()

@router.get("/", response_model=list[Goal])
def get_goals(db: Session = Depends(get_db)):
    return goal_editor.get_goals(db)

@router.get("/{id}", response_model=Goal)
def get_goal(id : int, db: Session = Depends(get_db)):
    return goal_editor.get_goal_id(id, db)

@router.put("/{id}", response_model=Goal)
def put_goal(id : int, goal : Goal, db: Session = Depends(get_db)):
    return goal_editor.update_goal(id, goal, db)

@router.delete("/{id}", response_model=Goal)
def delete_goal(id : int, db: Session = Depends(get_db)):
    return goal_editor.delete_goal(id, db)

@router.post("/", response_model=Goal)
def post_goal(goal : Goal, db: Session = Depends(get_db)):
    return goal_editor.create_goal(goal, db)