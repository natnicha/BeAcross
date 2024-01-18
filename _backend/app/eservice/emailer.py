from aiosmtplib import send
from email.message import EmailMessage
from fastapi import BackgroundTasks
from dotenv import dotenv_values  # Using dotenv_values to load environment variables

# Load environment variables from the .env file in the root directory
config = dotenv_values(".env")

# Retrieve environment variables
GMAIL_USERNAME = config.get("GMAIL_USERNAME")
GMAIL_PASSWORD = config.get("GMAIL_PASSWORD")

async def send_email(background_tasks: BackgroundTasks, recipient_email: str, subject: str, content: str):
    message = EmailMessage()
    #message["From"] = GMAIL_USERNAME
    message["From"] = "beacrossapp@gmail.com"
    #message["To"] = recipient_email
    message["To"] = "victorypiesolutions@outlook.com"
    #message["Subject"] = subject
    message["Subject"] = "New Password"
    message.set_content(content)

    await send(
        message,
        hostname="smtp.gmail.com",
        port=587,
        #username=GMAIL_USERNAME,
        username="beacrossapp@gmail.com",
        #password=GMAIL_PASSWORD,
        password="lsgjoiexpmlnpjif",
        use_tls=True,
    )

    background_tasks.add_task(send_email, recipient_email, subject, content)
