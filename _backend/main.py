from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth.auth import auth
from app.api.module.module import module
from app.db.mongodb_utils import connect_to_mongo, close_mongo_connection
from app.db.settings_utils import load_settings
from app.config.config_utils import load_env
from app.middleware.middleware import security_checking

app = FastAPI()

app.include_router(auth, prefix='/api/v1/auth', tags=['auth'])
app.include_router(module, prefix='/api/v1/module', tags=['module'])

origins = ['http://localhost:3000']

app.add_middleware(
    CORSMiddleware, allow_origins=origins,
)

app.add_event_handler("startup", load_env)
app.add_event_handler("startup", connect_to_mongo)
app.add_event_handler("startup", load_settings)
app.add_event_handler("shutdown", close_mongo_connection)

@app.middleware("http")
async def middleware_checking(request: Request, call_next):
    return await security_checking(request, call_next)

@app.get("/")
async def root():
    return {"message": "Hello World"}
