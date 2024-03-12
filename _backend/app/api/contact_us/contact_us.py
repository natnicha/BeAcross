from fastapi import APIRouter, HTTPException, status

from app.api.contact_us.module import ContactUsRequest
from app.api.auth.auth_utils import validate_email
from app.email_service.email_sender import send_contact_us_email

contact_us = APIRouter()
@contact_us.post("/", status_code=status.HTTP_200_OK)
async def post_contact_us(
        items: ContactUsRequest
    ):
    is_valid_email = validate_email(items.email)
    if not is_valid_email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email is invalid format")
    
    try:
        await send_contact_us_email(user_email=items.email, user_name=items.name, message=items.message)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    
    return {"data": items}
