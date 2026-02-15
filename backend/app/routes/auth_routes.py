from fastapi import APIRouter
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


@router.post("/login")
def login(request: LoginRequest):
    user = authenticate_user(request.email, request.password)

    if not user:
        return {"error": "Invalid credentials"}

    access_token = create_access_token(
        {"sub": str(user.id), "role": user.role.name}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }