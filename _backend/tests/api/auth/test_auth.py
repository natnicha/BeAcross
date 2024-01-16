from fastapi import status
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)
def test_register_invalid_email_format():
    response = client.post(
        url="/api/v1/auth/register",
        headers={"Content-Type":"application/json"},
        json={"email":"abc"}
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json() ==  {"detail": {"message": "The email doesn't conform by email format, please input in format of example@university.de"}}
