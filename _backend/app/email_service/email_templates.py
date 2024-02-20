
password_reset_template = """
Dear {user},

Your password has been reset. Your new password is: {password}

Please change it after your next login.

Wishing you well,
Your Victory Pie Solutions Team
"""


registration_template = u"""
<html>
    <head>Hi <font color="#1e5af5">{user}!</font></head>
    <body font-family: 'Source Sans Pro'>
        <br>
        Welcome to <font color="#1e5af5">Across</font>. Thank you for registering with us. <br>
        We're excited to have you on board and can't wait to help you get started.<br>
        <br>
        <b>Let us do the work for you to plan studying across countries in Europe!</b><br>
        <br>
        To start your journey, please use details below:<br>
        Login email: <font color="#1e5af5">{email}</font><br>
        Your password is: <font color="#1e5af5">{password}</font><br>
        <br>
        <b>Ready to organize your new chapter of study life ?</b><br>
        <b><a href="http://localhost:3000/"><font color="#1e5af5">Across</font></a></b><br>
        <br>
        <font style="font-size:14px">Wishing you well,</font><br>
        <font style="font-size:14px">Your Victory Pie Solutions Team</font><br><br><br>
    </body>
    <footer style="font-size:10px" font-family: 'Source Sans Pro'>
        Remark<br>
        - Please keep your account information safe.<br>
        - This E-mail has been automatically sent by the system, please do not reply back. If you wish to contact us,<br>
        please send E-mail to <a href="Victorypiesolutions@outlook.com">Victorypiesolutions@outlook.com</a><br>
    </footer>
</html>
"""
