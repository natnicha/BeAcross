from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.auth.auth import auth
from db.mongodb_utils import *
from config.config_utils import *

app = FastAPI()

app.include_router(auth, prefix='/api/v1/auth', tags=['auth'])

origins = ['http://localhost:3000']

app.add_middleware(
    CORSMiddleware, allow_origins=origins,
)

app.add_event_handler("startup", load_env)
app.add_event_handler("startup", connect_to_mongo)
app.add_event_handler("shutdown", close_mongo_connection)

@app.get("/")
async def root():
    return {"message": "Hello World"}
