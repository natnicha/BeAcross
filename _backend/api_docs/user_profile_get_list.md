# ** [GET] User Profile List**

To get user profile list

## Request

| ** Method **     | GET                                                                                            |
| ---------------- | ---------------------------------------------------------------------------------------------- |
| ** Structure **  | `/api/v1/user/profile/list?{user_role}&{limit}&{offset}&{sortby}&{orderby}`                    |
| ** Example **    | `/api/v1/user/profile/list?user_role=student&limit=50&offset=10&sortby=user_role&orderby=desc` |

## Permissions

| Method          | Allow Acess                       |
| ----------------| ----------------------------------|
| student         | -                                 |
| uni-admin       | `/api/v1/user/profile/list`       |
| sys-admin       | `/api/v1/user/profile/list`       |

## Header Parameters

| Key                 | Type       | Required  | Description                                         |
| ------------------- | :--------: | :-------: | --------------------------------------------------- |
| Authorization       | string     | true      | Authorization JWT token in format of `Bearer <JWT>` |

## Path Parameters

| Key       | Type      | Required     | Permissions  | Description                     |
| --------- | :-------: | :----------: | :----------: | ------------------------------- |
|           |           |              |              |                                 |

## Query Parameters

| Key       | Type      | Required     | Default Value | Description                                                                                             |
| --------- | :-------: | :----------: | :-----------: | ------------------------------------------------------------------------------------------------------- |
| user_role | string    | false        | student       | a user role supports `student`, `uni-admin`, and `sys-admin`                                            |
| limit     | int       | false        | 20            | a limitation of module in number                                                                        |
| offset    | int       | false        | 0             | a starting position in the dataset of a particular record                                               |
| sortby    | string    | false        | first_name    | an entity referring how rows will be sorted in the response supports only `first_name`, and `user_role` |
| orderby   | string    | false        | asc           | a sorting direction supports two values, either `asc` for ascending order, or `desc` for the reverse    |

## Body Parameters

| Key          | Type         | Required     | Description                              |
| ------------ | :----------: | :----------: | ---------------------------------------- |
|              |              |              |                                          |


## Success Response 200 - OK
```json
{
  "total_results": 25,
  "total_items": 20,
  "items": [{
    "id": "65b038be6fe605cc9ce36df6",
    "email": "example.x@tu-chemnitz.de",
    "password": "09679f97a72df416ae47eca4b1d828c02163d045559d0e36e617494c3919a2a4:2b3f0c6c65ad49a4815cd9ad1e67ff52",
    "first_name": "example",
    "last_name": "x",
    "registration_number": null,
    "course_of_study": null,
    "semester": 1,
    "user_role": "student",
    "created_at": "2024-01-18T20:21:41.138000",
    "updated_at": "2024-01-18T20:21:41.138000"
  },
  {
    "id": "65b19027cb1bb81336500a6a",
    "email": "example.y@tu-chemnitz.de",
    "password": "09679f97a72df416ae47eca4b1d828c02163d045559d0e36e617494c3919a2a4:2b3f0c6c65ad49a4815cd9ad1e67ff52",
    "first_name": "example",
    "last_name": "y",
    "registration_number": null,
    "course_of_study": null,
    "semester": 1,
    "user_role": "student",
    "created_at": "2024-01-18T20:21:41.138001",
    "updated_at": "2024-01-18T20:21:41.138001"
  },
  // ... more entries ...
  ]
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
