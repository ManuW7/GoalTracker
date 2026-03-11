from pwdlib import PasswordHash
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

import app.services.errors as errors
from app.schemes import CreateUser, LoginUser, Token
from app.models.user import User as UserORM
from app.core.secure import create_access_token

from app.services.base import BaseService, user_db

class UserService(BaseService):
    def __init__(self):
        super().__init__()
        password_hash = PasswordHash.recommended()

    def _hash_password(password: str) -> str:
        return password_hash.hash(password)

    def _verify_password(password: str, hashed_password: str) -> bool:
        return password_hash.verify(password, hashed_password)
    
    def _schema_to_ORM_conv_for_create(self, user : CreateUser) -> UserORM:
        userORM = UserORM(
            username=user.username,
            hash_password=self._hash_password(user.password)
        )
        return userORM

    def register_user(self, user : CreateUser, ses: Session):
        user = user_db.get_by_username(user.username, ses)
        if user is not None:
            raise errors.UserAlreadyExists()
        
        user_db.create(self._schema_to_ORM_conv_for_create(user), ses)
        self._commit(ses)

    def login_user(self, user: LoginUser, ses: Session):
        user = user_db.get_by_username(user.username, ses)
        if user is None:
            raise errors.UserNotFound()
        
        if not self._verify_password(user.password, user.hash_password):
            raise errors.InvalidPassword()
        
        token = Token(access_token=create_access_token(str(user.id)))
        return token
        