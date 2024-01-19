import smtplib
from email.message import EmailMessage
from os import getenv

import uuid


from pydantic import BaseModel, EmailStr

class ResetPasswordRequest(BaseModel):
    email: EmailStr






def send_reset_email(to_email, reset_token):
    email_user = "beacrossapp@gmail.com"#getenv("EMAIL_USER")
    email_password = "lsgjoiexpmlnpjif"#getenv("EMAIL_PASSWORD")
    to_email = "sasan.bio7@gmail.com" #just for testing/ temporary
    msg = EmailMessage()
    msg['Subject'] = 'Password Reset'
    msg['From'] = email_user
    msg['To'] = to_email
    msg.set_content(f'Your password reset token is: 123')# ...is: {reset_token}')

    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
        smtp.login(email_user, email_password)
        smtp.send_message(msg)


def generate_reset_token():
    return str(uuid.uuid4())
