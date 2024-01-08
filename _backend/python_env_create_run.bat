@echo off

REM Create a virtual environment
python -m venv env

REM Activate the virtual environment
call env\Scripts\activate

REM Upgrade pip to the latest version
python -m pip install --upgrade pip

python -m pip install fastapi
python -m pip install uvicorn
python -m pip install "pymongo[srv]"


python -m uvicorn main:app --reload

PAUSE