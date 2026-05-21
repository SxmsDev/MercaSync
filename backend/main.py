from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.connection import engine, Base
from app.routes import routes
import app.models.models

Base.metadata.create_all(bind=engine)

app = FastAPI(title="MercaSync API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes.router)

@app.get("/")
def home():
    return {"message": "MercaSync funcionando"}