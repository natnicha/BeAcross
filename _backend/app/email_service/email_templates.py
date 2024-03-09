
password_reset_template = u"""
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
</head>
<body>
    <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
            <td align="center">
                <table cellpadding="0" cellspacing="0" border="0" width="600" style="border-collapse: collapse;">
                    <tr>
                        <td bgcolor="#ffffff" align="center" style="padding: 40px 0 30px 0;">
                            <h1>Dear {user},</h1>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" align="center" style="padding: 20px;">
                            <p>Your password has been reset. Your new password is: <strong>{password}</strong></p>
                            <p>Please change it after your next login.</p>
                            <p>Wishing you well,<br>Your Victory Pie Solutions Team</p>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#f4f4f4" align="center" style="padding: 10px;">
                            <p>Remark:</p>
                            <ul>
                                <li>Please keep your account information safe.</li>
                                <li>This email has been automatically sent by the system. Please do not reply back. If you wish to contact us, please send an email to <a href="mailto:Victorypiesolutions@outlook.com">Victorypiesolutions@outlook.com</a>.</li>
                            </ul>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
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


success_calculated_similarity_template = u"""
<html>
    <head>Hi <font color="#1e5af5">{user}!</font></head>
    <body font-family: 'Source Sans Pro'>
        <br>
        Thank you for your adding modules under your university.<br>
        All modules are succesfully imported.<br>
        <br>
        <b>Ready to checkout your modules?</b><br>
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
