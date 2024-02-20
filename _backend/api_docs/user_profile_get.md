# ** [GET] User Profile **

To get user profile according to a provided authentication token in API headers

## Request

| ** Method **     | GET                               |
| ---------------- | ----------------------------------|
| ** Structure **  | `/api/v1/user/profile`            |
| ** Example **    | `/api/v1/user/profile`            |

## Permissions

| Method          | Allow Acess                       |
| ----------------| ----------------------------------|
| student         | `/api/v1/user/profile`            |
| uni-admin       | `/api/v1/user/profile`            |
| sys-admin       | `/api/v1/user/profile`            |

## Header Parameters

| Key                 | Type       | Required  | Description                                         |
| ------------------- | :--------: | :-------: | --------------------------------------------------- |
| Authorization       | string     | true      | Authorization JWT token in format of `Bearer <JWT>` |

## Path Parameters

| Key       | Type      | Required     | Permissions  | Description                     |
| --------- | :-------: | :----------: | :----------: | ------------------------------- |
|           |           |              |              |                                 |

## Query Parameters

| Key       | Type      | Required     | Permissions  | Description                     |
| --------- | :-------: | :----------: | :----------: | ------------------------------- |
|           |           |              |              |                                 |

## Body Parameters

| Key          | Type         | Required     | Description                              |
| ------------ | :----------: | :----------: | ---------------------------------------- |
|              |              |              |                                          |


## Success Response 200 - OK
```json
{
  "data": {
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
