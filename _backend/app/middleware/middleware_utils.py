
from fastapi import Request

def is_public_path(api: str):
    if api == '/':
        return True
    
    if api.__contains__('/api/v1/auth'):
        return True
    
    if api.__contains__('/docs') or api.__contains__('/openapi.json') :
        return True
    
    return False

async def is_include_request_body_if_post(request: Request):
    method = request.method
    if method == "POST":
        body = await request.body()
        if body == bytes():
            return False
    return True
