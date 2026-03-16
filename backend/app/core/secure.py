from datetime import datetime, timedelta, timezone
from fastapi import Depends, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

import app.services.errors as errors
from app.db.session import get_db
from app.models.user import User

SECRET_KEY = "new_secret_key_for_jwt_token_generation"  # In production, use a secure method to store this key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 120

def create_access_token(user_id: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    payload = {
        "sub": user_id,
        "exp": expire,
    }

    encoded_jwt = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise errors.InvalidToken()

    user_id = payload.get("sub")
    if user_id is None:
        raise errors.InvalidToken()

    user = db.get(User, int(user_id))
    if user is None:
        raise errors.UserNotFound()

    return int(user_id)