from fastapi import APIRouter, HTTPException
from app.services.service import ActionService
from app.schemes import Action
from datetime import datetime

router = APIRouter(prefix = "/actions")
action_editor = ActionService()

@router.get("/", response_model=list[Action])
def get_actions(start : datetime, finish : datetime):
    return action_editor.get_actions(start, finish)

@router.get("/{id}", response_model=Action)
def get_action(id : int):
    return action_editor.get_action_id(id)

@router.put("/{id}", response_model=Action)
def put_action(id : int, action : Action):
    return action_editor.update_action(id, action)

@router.delete("/{id}")
def delete_action(id : int):
    return action_editor.delete_action(id)

@router.post("/")
def post_action(action : Action):
    return action_editor.create_action(action)