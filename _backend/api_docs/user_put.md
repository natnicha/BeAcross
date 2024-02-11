# ** [PUT] User **

To update user account according to a provided user ID in path parameter or by Authentication token. If there is no user ID provided in path parameter (see: structure 2), the system would use a user ID from Authentication token instead.

## Request

| ** Method **      | PUT                                     |
| ----------------- | --------------------------------------- |
| ** Structure 1 ** | `/api/v1/user/{user-id}`                |
| ** Structure 2 ** | `/api/v1/user`                          |
| ** Example 1 **   | `/api/v1/user/65b038be6fe605cc9ce36df6` |
| ** Example 2 **   | `/api/v1/user`                          |

## Permissions

| Method          | Allow Acess                                 |
| ----------------| ------------------------------------------- |
| student         | `/api/v1/user`                              |
| uni-admin       | `/api/v1/user` and `/api/v1/user/{user-id}` |
| sys-admin       | `/api/v1/user` and `/api/v1/user/{user-id}` |

## Header Parameters

| Key                 | Type       | Required  | Description                                         |
| ------------------- | :--------: | :-------: | --------------------------------------------------- |
| Authorization       | string     | true      | Authorization JWT token in format of `Bearer <JWT>` |

## Path Parameters

| Key       | Type      | Required     | Permissions  | Description                                          |
| --------- | :-------: | :----------: | :----------: | ---------------------------------------------------- |
| user-id   | string    | false        |              | a user ID indicating an account would like to update |

## Query Parameters

| Key       | Type      | Required     | Permissions  | Description                     |
| --------- | :-------: | :----------: | :----------: | ------------------------------- |
|           |           |              |              |                                 |

## Body Parameters

| Key                 | Type         | Required     | Description                                  |
| ------------------- | :----------: | :----------: | -------------------------------------------- |
| email               | string(128)  | true         | a user email identifing one's university and is conformed email structure e.g., example@tu-chemnitz.de                       |
| password            | string(64)   | true         | a password consisting of 8-64 characters with at least 1 upper case letter[a-z], 1 lower case letter[A-Z], 1 numeric character [0-9], and 1 special character [!%&-.@^_]. If password is unchanged, send the encoded password back |
| first_name          | string(64)   | true         | a user's first name                          |
| last_name           | string(64)   | true         | a user's last name                           |
| registration_number | string(64)   | true         | a user's registration number, AKA student ID |
| course_of_study     | string(128)  | true         | a user's course of study                     |
| semester            | int          | true         | a user's semester where (s)he is in          |


## Success Response 200 - Success
```json
{
  "data": {
      "id": "65b038be6fe605cc9ce36df6",
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
```

## Error Response 401 - Unauthorized (case: no authorization in a request header)
```json
{
  "detail" : {
    "message": "invalid authorization token or token expired"
  }
}
```

## Error Response 403 - Forbidden (case: no right to access this route)
```json
{
  "detail" : {
    "message": "insufficient permissions"
  }
}
```

## Error Response 404 - Not Found (case: the user is not found)
```json
{
    "detail": {
        "message": "the user is not found"
    }
}
```

## Error Response 500 - Internal Server Error (case: server down)
```json
{
  "detail" : {
    "message" : "Server error",
  }
}
```

## Error Response 503 - Service Unavailable (case: Can't connect to 3rd party)
```json
{
  "detail" : {
    "message" : "Couldn't connect to third party",
  }
}
```
