from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.auth.auth import auth
from app.api.module.module import module
from app.db.mongodb_utils import connect_to_mongo, close_mongo_connection
from app.db.settings_utils import load_settings
from app.api.auth.auth_utils import check_permission, is_include_request_body_if_post, is_public_path, is_valid_jwt_token
from app.config.config_utils import load_env

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
async def check_authentication(request: Request, call_next):
    if not is_public_path(request.url.path):
        if not is_valid_jwt_token(request):
            return JSONResponse(
                {"message": "invalid authorization token or token expired"}, 
                status_code=status.HTTP_401_UNAUTHORIZED
            )
        
        if not check_permission(request):
            return JSONResponse(
                {"message": "insufficient permissions"}, 
                status_code=status.HTTP_403_FORBIDDEN
            )
        
        is_include_request_body = await is_include_request_body_if_post(request)
        if not is_include_request_body:
            return JSONResponse(
                {"message": "no request body provided"},
                status_code=status.HTTP_400_BAD_REQUEST
            )
    return await call_next(request)

@app.get("/")
async def root():
    return {"message": "Hello World"}
