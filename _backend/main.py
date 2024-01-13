from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from auth.auth import auth

app = FastAPI()

app.include_router(auth, prefix='/api/v1/auth', tags=['auth'])

origins = ['http://localhost:3000']

app.add_middleware(
    CORSMiddleware, allow_origins=origins,
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

