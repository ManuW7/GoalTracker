from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime

from app.services.service import GoalService
from app.schemes import GoalCreate, GoalUpdate, GoalResponse
from app.db.session import get_db
from app.core.secure import get_current_user

router = APIRouter(prefix = "/goals")
goal_editor = GoalService()

@router.get("/", response_model=list[GoalResponse])
def get_goals(start : datetime | None = None, finish : datetime | None = None,
                db: Session = Depends(get_db), 
                user_id : int = Depends(get_current_user)):
    return goal_editor.get_goals(user_id, start, finish, db)

@router.get("/{id}", response_model=GoalResponse)
def get_goal(id : int, db: Session = Depends(get_db),
             user_id : int = Depends(get_current_user)):
    return goal_editor.get_goal_id(id, user_id, db)

@router.put("/{id}", response_model=GoalResponse)
def put_goal(id : int, goal : GoalUpdate, db: Session = Depends(get_db),
             user_id : int = Depends(get_current_user)):
    return goal_editor.update_goal(id, goal, user_id, db)

@router.delete("/{id}", response_model=GoalResponse)
def delete_goal(id : int, db: Session = Depends(get_db),
                user_id : int = Depends(get_current_user)):
    return goal_editor.delete_goal(id, user_id, db)

@router.post("/", response_model=GoalResponse)
def post_goal(goal : GoalCreate, db: Session = Depends(get_db),
              user_id : int = Depends(get_current_user)):
    return goal_editor.create_goal(goal, user_id, db)