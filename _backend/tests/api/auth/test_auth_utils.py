from app.api.auth.auth_utils import generate_jwt, validate_jwt_token
from app.config.config_utils import load_env

def test_validate_jwt_token_invalid_token(benchmark):
    jwt_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YTZiZDkwYjMwNzZhNTQxY2IzYjY5MyIsImlhdCI6MTcwNTQyMjc4MSwiZXhwIjoxNzA1NDI2MzgxfQ.EG1zagQzWtMfHfcQ37S16IZ10XflEM9PtjExseD4RIM"
    load_env()
    try:
        benchmark(validate_jwt_token, jwt_token)
        assert False
    except Exception as e:
        assert True
        

def test_generate_jwt(benchmark):
    jwt_token = generate_jwt('1', '65a8040bfbc5863974a6d4e2', 'Technische Universitat Chemnitz')
    load_env()
    try:
        benchmark(validate_jwt_token, jwt_token)
        assert True
    except Exception as e:
        assert False
    