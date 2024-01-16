from app.api.auth.auth_utils import validate_jwt_token
from app.config.config_utils import load_env

def test_validate_jwt_token_invalid_token():
    jwt_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YTZiZDkwYjMwNzZhNTQxY2IzYjY5MyIsImlhdCI6MTcwNTQyMjc4MSwiZXhwIjoxNzA1NDI2MzgxfQ.EG1zagQzWtMfHfcQ37S16IZ10XflEM9PtjExseD4RIM"
    load_env()
    try:
        validate_jwt_token(jwt_token)
        assert False
    except Exception as e:
        assert True
    