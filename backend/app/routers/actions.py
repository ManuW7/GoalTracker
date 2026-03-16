from fastapi import APIRouter, Depends
from datetime import datetime
from sqlalchemy.orm import Session

from app.schemes import ActionCreate, ActionResponse, ActionUpdate
from app.services.service import ActionService
from app.db.session import get_db
from app.core.secure import get_current_user

router = APIRouter(prefix = "/actions")
action_editor = ActionService()

@router.get("/", response_model=list[ActionResponse])
def get_actions(start : datetime, finish : datetime, 
                db: Session = Depends(get_db),
                user_id : int = Depends(get_current_user)):
    return action_editor.get_actions(start, finish, user_id, db)

@router.get("/{id}", response_model=ActionResponse)
def get_action(id : int, db: Session = Depends(get_db), 
                user_id : int   = Depends(get_current_user)):
    return action_editor.get_action_id(id, user_id, db)

@router.put("/{id}", response_model=ActionResponse)
def put_action(id : int, action : ActionUpdate, db: Session = Depends(get_db), 
                user_id : int = Depends(get_current_user)):
    return action_editor.update_action(id, action, user_id, db)

@router.delete("/{id}", response_model=ActionResponse)
def delete_action(id : int, db: Session = Depends(get_db), 
                  user_id : int = Depends(get_current_user)):
    return action_editor.delete_action(id, user_id, db)

@router.post("/", response_model=ActionResponse)
def post_action(action : ActionCreate, db: Session = Depends(get_db), 
                 user_id : int = Depends(get_current_user)):
    return action_editor.create_action(action, user_id, db)