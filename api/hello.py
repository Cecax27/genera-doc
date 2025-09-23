# api/users.py
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def get_all_users():
    return {"users": ["Alice", "Bob"]}

@app.get("/details")
def get_user_details():
    return {"details": "Some user details"}