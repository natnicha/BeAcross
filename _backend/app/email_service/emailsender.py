import aiosmtplib
from email.message import EmailMessage
from pydantic import BaseModel  
from fastapi import HTTPException  

from .emailtemplates import password_reset_template, registration_template
from app.config.config_utils import env_config
from app.api.auth.model import LoginRequestModel, RegisterRequestModel

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
     


async def send_newpass_email(user_email: str, password: str, user_name: str):
    email_body = password_reset_template.format(password=password, user=user_name)

    try:
        await send_email(
            receiver_email=user_email,
            subject="Password Reset",
            body=email_body,                            # template with the new password
            sender_email=env_config.EMAIL_SENDER,       # Gmail username
            sender_password=env_config.EMAIL_PASSWORD   # Gmail app password
        )
        return {"message": "Password reset email sent successfully", "new_password": password}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


async def send_registration_email(user_email: str, user_name: str):
    email_body = registration_template.format(user=user_name)

    try:
        await send_email(
            receiver_email=user_email,
            subject="Welcome to Across",
            body=email_body,
            sender_email=env_config.EMAIL_SENDER, 
            sender_password=env_config.EMAIL_PASSWORD  # Gmail app password
        )
        return True
    except Exception as e:
        raise e
    