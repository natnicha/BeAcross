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

def test_is_public_path_get_module():
    api = '/api/v1/module/65a8041efbc5863974a6d4e4'
    method = 'GET'
    assert is_public_path(api, method)

def test_not_is_public_path_post_module_comment():
    api = '/api/v1/module'
    method = 'POST'
    assert not is_public_path(api, method)

def test_not_is_public_path_put_module_comment():
    api = '/api/v1/module/65a8041efbc5863974a6d4e4'
    method = 'PUT'
    assert not is_public_path(api, method)

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

def test_is_public_path_get_module_suggested():
    api = '/api/v1/module/65a8041efbc5863974a6d4e4/suggested'
    method = 'GET'
    assert is_public_path(api, method)

def test_is_public_path_get_module_comment():
    api = '/api/v1/module/65ac17b1d2815b505f3e352d/comment'
    method = 'GET'
    assert is_public_path(api, method)

def test_is_public_path_get_semester():
    api = '/api/v1/semester?sortby=name&orderby=desc'
    method = 'GET'
    assert is_public_path(api, method)
