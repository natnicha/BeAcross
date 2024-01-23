import aiosmtplib
from email.message import EmailMessage
from pydantic import BaseModel  
from fastapi import HTTPException  
import secrets
import string
from .emailtemplates import password_reset_template, registration_template
from ..config.config_utils import env_config
from ..api.auth.model import LoginRequestModel, RegisterRequestModel



async def send_email(receiver_email: str, subject: str, body: str, sender_email: str, sender_password: str):
    message = EmailMessage()
    message["From"] = sender_email
    message["To"] = receiver_email
    message["Subject"] = subject
    message.set_content(body)

    try:
        await aiosmtplib.send(
            message,
            hostname="smtp.gmail.com",
            port=587,
            start_tls=True,
            username=sender_email,
            password=sender_password
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
     

def pass_maker(length=8):
    characters = string.ascii_letters + string.digits + string.punctuation
    return ''.join(secrets.choice(characters) for i in range(length))

async def send_newpass_email(request: RegisterRequestModel):
    new_password = pass_maker()
    user_name= "TestUser" #name or the email address of the user
    email_body = password_reset_template.format(password=new_password, user=user_name)

    try:
        await send_email(
            receiver_email=request.email,
            subject="Password Reset",
            body=email_body,                            # template with the new password
            sender_email=env_config.EMAIL_SENDER,       # Gmail username
            sender_password=env_config.EMAIL_PASSWORD   # Gmail app password
        )
        return {"message": "Password reset email sent successfully", "new_password": new_password}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


async def send_registration_email(user_email: str):
    email_body = registration_template

    try:
        await send_email(
            receiver_email=user_email,
            subject="Welcome to BeAcross",
            body=email_body,
            sender_email=env_config.EMAIL_SENDER, 
            sender_password=env_config.EMAIL_PASSWORD  # Gmail app password
        )
        return {"message": "Registration email sent successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))