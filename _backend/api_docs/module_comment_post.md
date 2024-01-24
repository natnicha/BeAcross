# ** [POST] Comment in a Module **

A student can share own comments for a specified module by making a request with post method to a system. This action shows how they felt after taking this course to new students.

## Request

| ** Method **     | POST                              |
| ---------------- | ----------------------------------|
| ** Structure **  | `/api/v1/module/comment`          |
| ** Example **    | `/api/v1/module/comment`          |

## Permissions

| Method          | Allow Acess                       |
| ----------------| ----------------------------------|
| student         | `/api/v1/module/comment`          |
| uni-admin       | -                                 |
| sys-admin       | -                                 |

## Header Parameters

| Key                 | Type       | Required  | Description                                         |
| ------------------- | :--------: | :-------: | --------------------------------------------------- |
| content-type        | string     | true      | Content-Type has to be `application/json`           |
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

| Key          | Type         | Required     | Description                               |
| ------------ | :----------: | :----------: | ----------------------------------------- |
| module_id    | string       | true         | a module ID which would like to recommend |
| message      | string       | true         | a comment from a user                     |


## Sample Body Parameter Json Request
```json
{
  "module_id": "65a54de25eb0e12eb0a93e3a",
  "message": "this course is awesome!"
}
```

## Success Response 201 - Created
```json
{
    "message": "successful commented",
    "data": {
        "module_id": "65aa8b61329a5b7064db8eca",
        "message": "this course is awesome",
        "user_id": "65a98971f0de3d84f8c9a3d5",
        "created_at": "2024-01-19T16:16:21.023783",
        "updated_at": "2024-01-19T16:16:21.023783",
        "id": "65aaafcf55de1fe16e64fdd3"
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
