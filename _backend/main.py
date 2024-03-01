from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.auth.auth import auth
from app.api.module.module import module
from app.api.personal_plan.personal_plan import personal_plan
from app.api.user.user import user
from app.api.semester.semester import semester
from app.db.mongodb_utils import connect_to_mongo, close_mongo_connection
from app.db.settings_utils import load_settings
from app.config.config_utils import load_env, setup_logging
from app.middleware.middleware import security_checking

app = FastAPI()

app.include_router(auth, prefix='/api/v1/auth', tags=['auth'])
app.include_router(module, prefix='/api/v1/module', tags=['module'])
app.include_router(personal_plan, prefix='/api/v1/personal-plan', tags=['personal-plan'])
app.include_router(semester, prefix='/api/v1/semester', tags=['semester'])
app.include_router(user, prefix='/api/v1/user', tags=['user'])

#frontend_origins = ['http://localhost:3000']
frontend_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=frontend_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_event_handler("startup", load_env)
app.add_event_handler("startup", setup_logging)
app.add_event_handler("startup", connect_to_mongo)
app.add_event_handler("startup", load_settings)
app.add_event_handler("shutdown", close_mongo_connection)

@app.middleware("http")
async def middleware_checking(request: Request, call_next):
    if request.method == "OPTIONS":
        headers = {
            "Access-Control-Allow-Origin": frontend_origins[0],
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Credentials": "true",
        }
        return JSONResponse(content="", status_code=status.HTTP_200_OK, headers=headers)
    return await security_checking(request, call_next)

@app.get("/")
async def root():
    return {"message": "Hello World"}
