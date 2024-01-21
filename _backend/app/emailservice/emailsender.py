import aiosmtplib
from email.message import EmailMessage
from pydantic import BaseModel    

async def send_email(receiver_email: str, subject: str, body: str, sender_email: str, sender_password: str):
    message = EmailMessage()
    message["From"] = sender_email
    message["To"] = receiver_email
    message["Subject"] = subject
    message.set_content(body)

    await aiosmtplib.send(
        message,
        hostname="smtp.gmail.com",
        port=587,
        start_tls=True,
        username=sender_email,
        password=sender_password
    )

class PasswordResetRequest(BaseModel):                  #here, email through body as json
    email: str       

