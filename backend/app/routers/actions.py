from fastapi import APIRouter, HTTPException
from app.services.service import ActionService
from app.schemes import Action
from datetime import datetime

router = APIRouter(prefix = "/actions")
action_editor = ActionService()

@router.get("/", response_model=list[Action])
def get_actions(start : datetime, finish : datetime):
    actions = action_editor.get_actions(start, finish)
    return actions

@router.get("/{id}", response_model=Action)
def get_action(id : int):
    action = action_editor.get_action_id(id)
    if not action:
        raise HTTPException(status_code=404, detail="Action not found for get")
    return action

@router.put("/{id}", response_model=Action)
def put_action(id : int, action : Action):
    edit = action_editor.update_action(id, action)
    if not edit: 
        raise HTTPException(status_code=404, detail="Action not found for put")
    return edit

@router.delete("/{id}")
def delete_action(id : int):
    result = action_editor.delete_action(id)
    if not result:
        raise HTTPException(status_code=404, detail="Action not found for delete")
    return

@router.post("/")
def post_action(action : Action):
    if action.id != -1:
        raise HTTPException(status_code=404, detail="Post action id not equal -1")
    action_editor.create_action(action)