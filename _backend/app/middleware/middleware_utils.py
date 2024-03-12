
import re
from fastapi import Request

def is_public_path(api: str, method: str):
    if api == '/':
        return True
    
    if api.__contains__('/api/v1/auth'):
        return True
    
    if api.__contains__('/docs') or api.__contains__('/openapi.json') :
        return True
    
    if api.__contains__('/api/v1/contact-us'):
        return True
    
    if api.__contains__('/api/v1/module/search'):
        return True

    if api.__contains__("/recommend") and method in ['GET']:
        return True
    
    suggested_module_pattern = '''^/api/v1/module/[a-zA-Z0-9]+/suggested$'''
    if re.match(suggested_module_pattern, api):
        return True
    
    module_comment_pattern = '''^/api/v1/module/[a-zA-Z0-9]+/comment$'''
    if re.match(module_comment_pattern, api):
        return True
    
    get_module_pattern = '''^/api/v1/module/[a-zA-Z0-9]+$'''
    if re.match(get_module_pattern, api) and method == 'GET':
        return True
    
    if api.__contains__('/api/v1/semester'):
        return True
    
    return False

async def is_include_request_body_if_post(request: Request):
    method = request.method
    if method == "POST":
        body = await request.body()
        if body == bytes():
            return False
    return True
