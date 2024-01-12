# ** [POST] Register to auth **

## Request

| ** Method **     | POST                              |
| ---------------- | ----------------------------------|
| ** Structure **  | `/api/v1/auth/register`           |
| ** Example **    | `/api/v1/auth/register`           |

## Permissions

| Method          | Allow Acess                       |
| ----------------| ----------------------------------|
| guest           | `/api/v1/auth/register`           |

## Header Parameters

| Key                 | Type       | Required  | Description                                            |
| ------------------- | :--------: | :-------: | ------------------------------------------------------ |
| correlation-uid     | UUID       | false     | Correlation ID. Must be UUID format. For tracing data. |
| content-type        | string     | true      | Content-Type has to be `application/json`              |

## Path Parameters

| Key       | Type      | Required     | Permissions  | Description                     |
| --------- | :-------: | :----------: | :----------: | ------------------------------- |
|           |           |              |              |                                 |

## Query Parameters

| Key       | Type      | Required     | Permissions  | Description                     |
| --------- | :-------: | :----------: | :----------: | ------------------------------- |
|           |           |              |              |                                 |

## Body Parameters

| Key                  | Type           | Required     | Description                                                                                                                  |
| -------------------- | :------------: | :----------: | ---------------------------------------------------------------------------------------------------------------------------- |
| email                | string(127)    | true         | a user email identifing one's university and is conformed email structure e.g., example@tu-chemnitz.de                       |
| password             | string(64)     | true         | a password consisting of 8-64 characters with at least 1 upper case alphabet, 1 lower case alphabet, and 1 special character |
| first_name           | string(32)     | true         | a user's first name                                                                                                          |
| last_name            | string(32)     | true         | a user's last name                                                                                                           |

## Sample Body Parameter Json Request
```json
{
  "email": "example@tu-chemnitz.de",
  "first_name": "john",
  "last_name": "doe",
  "user_pin": "P@ssw0rd"
}
```
## Success Response 200 - OK
```json
{
  "message" : "Successful registered",
  "data": {
    "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
  }
}
```

## Error Response 400 - Bad Request (case: user data is aleady existed.)
```json
{
  "message" : "the email is already taken, please check again",
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
  "message" : "Can not connect to third party.",
  "data": {}
}
```
