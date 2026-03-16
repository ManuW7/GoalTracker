from pwdlib import PasswordHash
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

import app.services.errors as errors
from app.schemes import CreateUser, Token
from app.models.user import User as UserORM
from app.core.secure import create_access_token

from app.services.base import BaseService, user_db

class UserService(BaseService):
    def __init__(self):
        super().__init__()
        self.password_hash = PasswordHash.recommended()

    def _hash_password(self, password: str) -> str:
        return self.password_hash.hash(password)

    def _verify_password(self, password: str, hashed_password: str) -> bool:
        return self.password_hash.verify(password, hashed_password)

    def _schema_to_ORM_conv_for_create(self, user : CreateUser) -> UserORM:
        userORM = UserORM(
            username=user.username,
            hash_password=self._hash_password(user.password)
        )
        return userORM

    def register_user(self, user : CreateUser, ses: Session):
        user_in_bd = user_db.get_by_username(user.username, ses)
        if user_in_bd is not None:
            raise errors.UserAlreadyExists()
        
        created_user = user_db.create(self._schema_to_ORM_conv_for_create(user), ses)
        self._commit(ses)
        return Token(access_token=create_access_token(str(created_user.id)))

    def login_user(self, username: str, password: str, ses: Session):
        user_in_bd = user_db.get_by_username(username, ses)
        if user_in_bd is None:
            raise errors.UsernameNotFound()
        
        if not self._verify_password(password, user_in_bd.hash_password):
            raise errors.InvalidPassword()
        
        token = Token(access_token=create_access_token(str(user_in_bd.id)))
        return token
        
