from email.mime.text import MIMEText
from email.utils import formataddr
import aiosmtplib
from fastapi import HTTPException  

from .email_templates import *
from app.config.config_utils import env_config

async def send_email(receiver_email: str, subject: str, body: str, sender_email: str, sender_password: str):
    message = MIMEText(body, "html")
    message["From"] = formataddr(('Across', sender_email))
    message["To"] = receiver_email
    message["Subject"] = subject

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


async def send_registration_email(user_email: str, password: str, user_name: str):
    email_body = registration_template.format(user=user_name, password=password, email=user_email)
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

async def send_success_calculated_similarity_email(user_email: str, user_name: str):
    email_body = success_calculated_similarity_template.format(user=user_name)
    try:
        await send_email(
            receiver_email=user_email,
            subject="Your uploaded modules are ready",
            body=email_body,
            sender_email=env_config.EMAIL_SENDER, 
            sender_password=env_config.EMAIL_PASSWORD  # Gmail app password
        )
        return True
    except Exception as e:
        raise e

async def send_contact_us_email(user_email: str, user_name: str, message):
    email_body_to_VPS = contact_us_reply_to_VPS_template.format(user=user_name, email=user_email, message=message)
    email_body_to_users = contact_us_reply_to_users_template.format(user=user_name, email=user_email)
    try:
        await send_email(
            receiver_email=env_config.EMAIL_CONTACT_US,
            subject="Victory Pie Solutions - Contact Us",
            body=email_body_to_VPS,
            sender_email=env_config.EMAIL_SENDER, 
            sender_password=env_config.EMAIL_PASSWORD  # Gmail app password
        )
        await send_email(
            receiver_email=user_email,
            subject="Thank you for contacting Across",
            body=email_body_to_users,
            sender_email=env_config.EMAIL_SENDER, 
            sender_password=env_config.EMAIL_PASSWORD  # Gmail app password
        )
        return True
    except Exception as e:
        raise e
