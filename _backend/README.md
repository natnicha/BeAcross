# Across Backend Services

## How to set up your environment

1. To setup your work environment, execute this file once.

```
python_env_create_run.bat
```

```
//for Linux
cp .env.example .env
python3 -m venv env
source env/bin/activate
python -m pip install --upgrade pip
python -m pip install fastapi uvicorn "pymongo[srv]" python-dotenv python-dotenv pytest httpx mongomock pytest-env pytest-mock pyjwt
```

2. There will be .env file, find all service secrets or ask your colleagues and fill in there.

## How to installs all packages specified in Pipfile.lock. (AKA update/upgrade/sync)

1. make sure you are in ./\_backend
2. install all packages specified in Pipfile.lock using the following command

```
python3.10.exe -m pipenv sync
```

## How to start backend services

1. make sure you are in ./\_backend
2. activate your virtual env by (only once)

```
{env}\Scripts\activate
env/bin/activate (for Linux)
```

3. run this command to start service

```
python -m uvicorn main:app
python3 -m uvicorn main:app (for Linux)
```

## How to run test

### 1. Unit and functional tests
#### 1.1 all test cases

```
pytest -v -s --html=report.html
```

#### 1.2 only a specific file

```
pytest .\test\test_main.py --html=report.html
```

### 2. Performance Test
####
```
 pytest --benchmark-histogram
```

### 3. Security tests
```
safety check --save-html .
```

#### 3.2 Development environment tests

```
safety scan --save-html .
```
