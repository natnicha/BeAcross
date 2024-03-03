# ** [POST] Forgot Password **

To get a new password, when forgetting the new one.

## Request

| ** Method **     | POST                              |
| ---------------- | ----------------------------------|
| ** Structure **  | `/api/v1/auth/forgot-password`    |
| ** Example **    | `/api/v1/auth/forgot-password`    |

## Permissions

| Method          | Allow Acess                       |
| ----------------| ----------------------------------|
| student         | `/api/v1/auth/forgot-password`    |
| uni-admin       | `/api/v1/auth/forgot-password`    |
| sys-admin       | `/api/v1/auth/forgot-password`    |

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

| Key          | Type         | Required     | Description                                                |
| ------------ | :----------: | :----------: | ---------------------------------------------------------- |
| email        | EmailStr     | true         | a user email that needs a new password                     |


## Sample Body Parameter Json Request
```json
{
  "email": "example@tu-chemnitz.de"
}
```

## Success Response 200 - OK
```json
{
    "message": "If your account with that email was found, we've sent you an email with the new password."
}
```

## Error Response 404 - NOT_FOUND (case: The email is not registered in the system)
```json
{
 "detail": { 
    "message" : "User not found",
 }
}
```

## Error Response 400 - Bad Request (case: request body is empty)
```json
{
 "detail": { 
    "message": "no request body provided",
 }
}
```

## Error Response 422 - Unprocessable Entity (case: the body request is incorrect)
```json
{
    "detail": [
        {
            "type": "json_invalid",
            "loc": [
                "body",
                0
            ],
            "msg": "JSON decode error",
            "input": {},
            "ctx": {
                "error": "Expecting value"
            }
        }
    ]
}
```

## Error Response 500 - Internal Server Error (case: Updating the new password or Sending the email failed)
```json
{
 "detail": { 
    "message" : "Failed to update password.",
 }
}
```

## Error Response 503 - Service Unavailable (case: Can't connect to 3rd party)
```json
{
 "detail": { 
    "message" : "Couldn't connect to third party",
 }
}
```
