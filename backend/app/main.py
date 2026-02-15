from fastapi import FastAPI
from app.database.init_db import init_db

app = FastAPI()

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/")
def root():
    return {"message": "Legal Assistant Backend Running"}

from app.routes.auth_routes import router as auth_router

app.include_router(auth_router)