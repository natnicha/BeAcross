
from fastapi import Request, status
from fastapi.responses import JSONResponse

from app.api.auth.auth_utils import has_permission, is_valid_jwt_token
from .middleware_utils import is_public_path, is_include_request_body_if_post

async def security_checking(request: Request, call_next):
    if not is_public_path(request.url.path):
        if not is_valid_jwt_token(request):
            return JSONResponse(
                {"message": "invalid authorization token or token expired"}, 
                status_code=status.HTTP_401_UNAUTHORIZED
            )
        
        if not has_permission(request):
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
