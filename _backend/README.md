# Across Backend Services

## How to set up your environment
1. To setup your work environment, execute this file once.
````
python_env_create_run.bat
```` 
2. There will be .env file, find all service secrets or ask your colleagues and fill in there.

## How to start backend services
1. make sure you are in ./_backend
2. activate your virtual env by (only once)
````
{env}\Scripts\activate
````
3. run this command to start service
````
python -m uvicorn main:app
````

## How to run test
````
pytest -v -s
````
