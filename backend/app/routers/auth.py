from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from sqlalchemy.orm import Session

from app.schemes import CreateUser, LoginUser
from app.db.session import get_db
from app.services.users import UserService

router = APIRouter(prefix = "/auth")
user_editor = UserService()

@router.post("/reg")
def register(user : CreateUser, db: Session = Depends(get_db)):
    user_editor.register_user(user, db)

@router.post("/login")
def login(user: LoginUser, db: Session = Depends(get_db)):
    return user_editor.login_user(user, db)
