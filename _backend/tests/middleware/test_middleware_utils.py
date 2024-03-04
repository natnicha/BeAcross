from fastapi.testclient import TestClient
from app.middleware.middleware_utils import is_public_path

from app.config.config_utils import load_env
from app.api.auth.auth import get_database
from main import app

client = TestClient(app)

def test_is_public_path_root():
    api = '/'
    method = 'GET'
    assert is_public_path(api, method)

def test_is_public_path_auth():
    api = '/api/v1/auth'
    method = 'POST'
    assert is_public_path(api, method)

def test_is_public_path_docs():
    api = '/docs'
    method = 'GET'
    assert is_public_path(api, method)

def test_is_public_path_openapi():
    api = '/openapi.json'
    method = 'GET'
    assert is_public_path(api, method)

def test_is_public_path_module_search():
    api = '/api/v1/module/search'
    method = 'GET'
    assert is_public_path(api, method)

def test_is_public_path_module_search_advanced():
    api = '/api/v1/module/search/advanced?term=("university":Chemnitz)&limit=200&sortby=no_of_suggested_modules&orderby=desc'
    method = 'GET'
    assert is_public_path(api, method)

def test_is_public_path_get_module_no_of_recommend():
    api = '/api/v1/module/65a8041efbc5863974a6d4e4/recommend'
    method = 'GET'
    assert is_public_path(api, method)

    api = '/api/v1/module/65a8041efbc5863974a6d4e5/recommend'
    method = 'GET'
    assert is_public_path(api, method)

def test_is_public_path_get_module_suggested():
    api = '/api/v1/module/65a8041efbc5863974a6d4e4/suggested'
    method = 'GET'
    assert is_public_path(api, method)
