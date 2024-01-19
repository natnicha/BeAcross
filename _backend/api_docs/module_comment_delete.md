# ** [DELETE] Comment in a Module **

A student can delete own comments once they have done using module-comment-id

## Request

| ** Method **     | DELETE                                            |
| ---------------- | ------------------------------------------------- |
| ** Structure **  | `/api/v1/module/comment/{module-comment-id}`      |
| ** Example **    | `/api/v1/module/comment/65aaafcf55de1fe16e64fdd3` |

## Permissions

| Method          | Allow Acess                       |
| ----------------| ----------------------------------|
| student         | `/api/v1/module/comment`          |
| uni-admin       | -                                 |
| sys-admin       | -                                 |

## Header Parameters

| Key                 | Type       | Required  | Description                                         |
| ------------------- | :--------: | :-------: | --------------------------------------------------- |
| Authorization       | string     | true      | Authorization JWT token in format of `Bearer <JWT>` |

## Path Parameters

| Key               | Type      | Required     | Permissions  | Description                                    |
| ----------------- | :-------: | :----------: | :----------: | ---------------------------------------------- |
| module_comment_id | string    | true         |              | a module comment ID which would like to delete |

## Query Parameters

| Key       | Type      | Required     | Permissions  | Description                     |
| --------- | :-------: | :----------: | :----------: | ------------------------------- |
|           |           |              |              |                                 |

## Body Parameters

| Key          | Type         | Required     | Description                               |
| ------------ | :----------: | :----------: | ----------------------------------------- |
|              |              |              |                                           |


## Success Response 200 - OK
  [no request body]

## Error Response 404 - Not Found (case: no comment found)
```json
{
    "detail": {
        "message": "no comment found"
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
