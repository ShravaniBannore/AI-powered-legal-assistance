from fastapi import FastAPI
from app.database.init_db import init_db
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for development only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/")
def root():
    return {"message": "Legal Assistant Backend Running"}

from app.routes.auth_routes import router as auth_router

app.include_router(auth_router)

from app.routes.chat_routes import router as chat_router

app.include_router(chat_router)

from app.database.base import Base
from app.database.connection import engine

Base.metadata.create_all(bind=engine)