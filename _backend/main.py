from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = ['http://localhost:3000']

app.add_middleware(
    CORSMiddleware, allow_origins=origins,
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

