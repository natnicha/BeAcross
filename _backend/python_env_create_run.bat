@echo off

REM copy .env.exmple to be environment variables
COPY .env.example .env

REM Create a virtual environment
python -m venv env

REM Activate the virtual environment
call env\Scripts\activate

REM Upgrade pip to the latest version
python -m pip install --upgrade pip

python -m pip install fastapi
python -m pip install uvicorn
python -m pip install "pymongo[srv]"
python -m pip install python-dotenv
python -m pip install pytest
python -m pip install nltk
python -m pip install unidecode
python -m pip install scikit-learn
python -m pip install httpx
python -m pip install mongomock
python -m pip install pytest-env
python -m pip install pytest-mock
python -m pip install pyjwt
python -m pip install owlready2
python -m pip install Cython
python -m pip install rdflib
python -m pip install aiosmtplib
python -m pip install filelock


python -m uvicorn main:app --reload

PAUSE