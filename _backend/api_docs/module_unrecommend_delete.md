# ** [DELETE] Unrecommend Module **

After a student performed 'recommend a module', (s)he can **undo or revert the recommend** by making a request with delete method to a system. This action shows that this course is canceled to recommend from the student anymore. But it **doesn't means that this course is contested**.

## Request

| ** Method **     | DELTE                                                 |
| ---------------- | ----------------------------------------------------- |
| ** Structure **  | `/api/v1/module/{module_id}/unrecommend`              |
| ** Example **    | `/api/v1/module/65a81c0502ed558ac053a095/unrecommend` |

## Permissions

| Method          | Allow Acess                                |
| ----------------| ------------------------------------------ |
| student         | `/api/v1/module/{module_id}/unrecommend`   |
| uni-admin       | -                                          |
| sys-admin       | -                                          |

## Header Parameters

| Key                 | Type       | Required  | Description                                         |
| ------------------- | :--------: | :-------: | --------------------------------------------------- |
| content-type        | string     | true      | Content-Type has to be `application/json`           |
| Authorization       | string     | true      | Authorization JWT token in format of `Bearer <JWT>` |

## Path Parameters

| Key       | Type      | Required     | Permissions  | Description                               |
| --------- | :-------: | :----------: | :----------: | ----------------------------------------- |
| module_id | string    | true         |              | a module ID which would like to recommend |

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

## Error Response 404 - Not Found (case: not found a module recommended by authenticated user)
```json
{
    "detail": {
        "message": "the module recommended by this user is not found"
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
