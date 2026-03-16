from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.schemes import CreateUser, Token
from app.db.session import get_db
from app.services.users import UserService

router = APIRouter(prefix = "/auth")
user_editor = UserService()

@router.post("/reg", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(user : CreateUser, db: Session = Depends(get_db)):
    return user_editor.register_user(user, db)

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(),
          db: Session = Depends(get_db)):
    return user_editor.login_user(form_data.username, form_data.password, db)
