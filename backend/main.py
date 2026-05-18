from fastapi import FastAPI
from app.database.connection import engine

app = FastAPI()

print(engine)

@app.get("/")
def home():
    return {"message": "MercaSync funcionando"}