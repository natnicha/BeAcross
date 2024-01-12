# ** [POST] Login **

## Request

| ** Method **     | POST                              |
| ---------------- | ----------------------------------|
| ** Structure **  | `/api/v1/auth/login`              |
| ** Example **    | `/api/v1/auth/login`              |

## Permissions

| Method          | Allow Acess                       |
| ----------------| ----------------------------------|
| student         | `/api/v1/auth/login`              |
| uni-admin       | `/api/v1/auth/login`              |
| sys-admin       | `/api/v1/auth/login`              |

## Header Parameters

| Key                 | Type       | Required  | Description                                 |
| ------------------- | :--------: | :-------: | ------------------------------------------- |
| Content-Type        | string     | true      | Content-Type has to be `application/json`   |

## Path Parameters

| Key       | Type      | Required     | Permissions  | Description                     |
| --------- | :-------: | :----------: | :----------: | ------------------------------- |
|           |           |              |              |                                 |

## Query Parameters

| Key       | Type      | Required     | Permissions  | Description                     |
| --------- | :-------: | :----------: | :----------: | ------------------------------- |
|           |           |              |              |                                 |

## Body Parameters

| Key          | Type         | Required     | Description                                                                                                                  |
| ------------ | :----------: | :----------: | ---------------------------------------------------------------------------------------------------------------------------- |
| email        | string(128)  | true         | a user email identifing one's university and is conformed email structure e.g., example@tu-chemnitz.de                       |
| password     | string(64)   | true         | a password consisting of 8-64 characters with at least 1 upper case alphabet, 1 lower case alphabet, and 1 special character |


## Sample Body Parameter Json Request
```json
{
  "email": "example@tu-chemnitz.de",
  "password": "P@ssw0rd"
}
```

## Success Response 200 - OK
```json
{
  "message" : "Login successfully",
  "data": {
    "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
  }
}
```

## Error Response 401 - Unauthorized (case: invalid email or password)
```json
{
  "message" : "Invalid email or password",
  "data": {}
}
```

## Error Response 400 - Bad Request (case: user data is aleady existed.)
```json
{
  "message" : "The email is already taken, please check again",
  "data": {}
}
```

## Error Response 422 - Unprocessable Entity (case: request body validation error)
```json
{
  "message": "Request body is invalid.",
  "data": {}
}
```

## Error Response 500 - Internal Server Error (case: server down)
```json
{
  "message" : "Server error",
  "data": {}
}
```

## Error Response 503 - Service Unavailable (case: Can't connect to 3rd party)
```json
{
  "message" : "Couldn't connect to third party",
  "data": {}
}
```
