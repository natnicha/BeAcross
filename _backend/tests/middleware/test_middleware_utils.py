from fastapi.testclient import TestClient
from app.middleware.middleware_utils import is_public_path

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

def test_is_public_path_auth_register():
    api = '/api/v1/auth/register'
    method = 'POST'
    assert is_public_path(api, method)

def test_is_public_path_auth_login():
    api = '/api/v1/auth/login'
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

def test_not_is_public_path_post_module():
    api = '/api/v1/module'
    method = 'POST'
    assert not is_public_path(api, method)

def test_not_is_public_path_put_module():
    api = '/api/v1/module/65a8041efbc5863974a6d4e4'
    method = 'PUT'
    assert not is_public_path(api, method)

def test_not_is_public_path_delete_module():
    api = '/api/v1/module/65a8041efbc5863974a6d4e4'
    method = 'DELETE'
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

def test_not_is_public_path_post_module_recommend():
    api = '/api/v1/module/recommend'
    method = 'POST'
    assert not is_public_path(api, method)

def test_not_is_public_path_delete_module_recommend():
    api = '/api/v1/module/65a8041efbc5863974a6d4e4/recommend'
    method = 'DELETE'
    assert not is_public_path(api, method)

def test_is_public_path_get_module_suggested():
    api = '/api/v1/module/65a8041efbc5863974a6d4e4/suggested'
    method = 'GET'
    assert is_public_path(api, method)

def test_is_public_path_get_module_comment():
    api = '/api/v1/module/65ac17b1d2815b505f3e352d/comment'
    method = 'GET'
    assert is_public_path(api, method)

def test_not_is_public_path_post_module_comment():
    api = '/api/v1/module/comment'
    method = 'POST'
    assert not is_public_path(api, method)

def test_not_is_public_path_delete_module_comment():
    api = '/api/v1/module/comment/65a8041efbc5863974a6d4e4'
    method = 'DELETE'
    assert not is_public_path(api, method)

def test_not_is_public_path_post_personal_plan():
    api = '/api/v1/personal-plan'
    method = 'POST'
    assert not is_public_path(api, method)

def test_not_is_public_path_get_personal_plan():
    api = '/api/v1/personal-plan'
    method = 'GET'
    assert not is_public_path(api, method)

def test_not_is_public_path_get_personal_plan_by_module_id():
    api = '/api/v1/personal-plan?module_id=65a8041efbc5863974a6d4e4'
    method = 'GET'
    assert not is_public_path(api, method)

def test_not_is_public_path_delete_personal_plan():
    api = '/api/v1/personal-plan/65a8041efbc5863974a6d4e4'
    method = 'DELETE'
    assert not is_public_path(api, method)

def test_is_public_path_get_semester():
    api = '/api/v1/semester?sortby=name&orderby=desc'
    method = 'GET'
    assert is_public_path(api, method)

def test_not_is_public_path_get_user_profile():
    api = '/api/v1/user/profile'
    method = 'GET'
    assert not is_public_path(api, method)

def test_not_is_public_path_get_user_profile_list():
    api = '/api/v1/user/profile/list'
    method = 'GET'
    assert not is_public_path(api, method)

def test_not_is_public_path_put_user_profile_by_admin():
    api = '/api/v1/user/65a8041efbc5863974a6d4e4'
    method = 'PUT'
    assert not is_public_path(api, method)

def test_not_is_public_path_put_user_profile_by_auth():
    api = '/api/v1/user'
    method = 'PUT'
    assert not is_public_path(api, method)

def test_not_is_public_path_delete_user_profile_by_admin():
    api = '/api/v1/user/65a8041efbc5863974a6d4e4'
    method = 'DELETE'
    assert not is_public_path(api, method)

def test_not_is_public_path_delete_user_profile_by_auth():
    api = '/api/v1/user'
    method = 'DELETE'
    assert not is_public_path(api, method)
