# ** [POST] Login **

To login to a system after registration

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
| password     | string(64)   | true         | a password consisting of 8-64 characters with at least 1 upper case letter[a-z], 1 lower case letter[A-Z], 1 numeric character [0-9], and 1 special character [!%&-.@^_] |


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
  "data": {
      "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
      "user": {
         "email": "example.z@tu-chemnitz.de",
         "password": "09679f97a72df416ae47eca4b1d828c02163d045559d0e36e617494c3919a2a4:2b3f0c6c65ad49a4815cd9ad1e67ff52",
         "first_name": "example",
         "last_name": "z",
         "registration_number": null,
         "course_of_study": null,
         "semester": 1,
         "user_role": "student",
         "created_at": "2024-01-18T20:21:41.138000",
         "updated_at": "2024-01-18T20:21:41.138000"
      }
  }
}
```

## Error Response 401 - Unauthorized (case: invalid email or password)
```json
{
 "detail": { 
    "message" : "Incorrect email or password",
 }
}
```

## Error Response 422 - Unprocessable Entity (case: request body validation error)
```json
{
 "detail": { 
    "message": "Request body is invalid.",
 }
}
```

## Error Response 500 - Internal Server Error (case: server down)
```json
{
 "detail": { 
    "message" : "Server error",
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
