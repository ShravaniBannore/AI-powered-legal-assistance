from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.auth.auth_service import register_user, authenticate_user
from app.auth.jwt_handler import create_access_token

router = APIRouter()


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str


class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/register")
def register(request: RegisterRequest):
    user, error = register_user(
        request.name,
        request.email,
        request.password,
        request.role
    )

    if error:
        return {"error": error}

    return {"message": "User registered successfully"}

from fastapi import Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.database.models import User
from app.auth.jwt_handler import create_access_token
class LoginRequest(BaseModel):
    email: str
    password: str


from app.auth.auth_service import verify_password

@router.post("/login")
def login(
    request: LoginRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == request.email).first()

    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(
        {"sub": str(user.id), "role": user.role.name}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }