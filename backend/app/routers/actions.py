from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from sqlalchemy.orm import Session

from app.schemes import Action
from app.services.service import ActionService
from app.db.session import get_db

router = APIRouter(prefix = "/actions")
action_editor = ActionService()

@router.get("/", response_model=list[Action])
def get_actions(start : datetime, finish : datetime, db: Session = Depends(get_db)):
    return action_editor.get_actions(start, finish, db)

@router.get("/{id}", response_model=Action)
def get_action(id : int, db: Session = Depends(get_db)):
    return action_editor.get_action_id(id, db)

@router.put("/{id}", response_model=Action)
def put_action(id : int, action : Action, db: Session = Depends(get_db)):
    return action_editor.update_action(id, action, db)

@router.delete("/{id}", response_model=Action)
def delete_action(id : int, db: Session = Depends(get_db)):
    return action_editor.delete_action(id, db)

@router.post("/", response_model=Action)
def post_action(action : Action, db: Session = Depends(get_db)):
    return action_editor.create_action(action, db)