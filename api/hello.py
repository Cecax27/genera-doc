from fastapi import FastAPI
from mangum import Mangum  # adapta ASGI a AWS Lambda/Vercel

app = FastAPI()

@app.get("/")
def get_all_users():
    return {"users": ["Alice", "Bob"]}

@app.get("/details")
def get_user_details():
    return {"details": "Some user details"}

# Adaptador para que Vercel pueda manejar la app
handler = Mangum(app)
