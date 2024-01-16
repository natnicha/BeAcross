import re
import secrets
import string
import uuid
import hashlib

def validate_email(email):
    pattern = '''^[\w\.-]+@[\w\.-]+\.\w+$'''
    if re.match(pattern, email):
        return True
    else:
        return False

def extract_domain_from_email(email):
    return email.split("@",1)[1]

def extractFullNameFromEmail(email, delimiter):
    full_name = email.split("@",1)[0]
    return full_name.split(delimiter,1)

def generatePassword():
    special_character = r"""!#$%&'()*+,-./:;<=>?@[\]^_`{|}~"""
    password_length = 8
    alphabet = string.ascii_letters + string.digits + special_character
    while True:
        password = ''.join(secrets.choice(alphabet) for i in range(password_length))
        if (sum(c.islower() for c in password) >=1
                and sum(c.isupper() for c in password) >=1
                and sum(c.isdigit() for c in password) >=1):
            break
    return password

# Basic hashing function for a text using random unique salt.
def hashText(text):
    salt = uuid.uuid4().hex
    return hashlib.sha256(salt.encode() + text.encode()).hexdigest() + ':' + salt
    
# Check for the text in the hashed text
def matchHashedText(hashedText, providedText):
    _hashedText, salt = hashedText.split(':')
    return _hashedText == hashlib.sha256(salt.encode() + providedText.encode()).hexdigest()
