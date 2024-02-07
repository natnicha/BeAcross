# ** [DELETE] User **

To delete user account according to a provided user ID in path parameter

## Request

| ** Method **     | DELETE                                  |
| ---------------- | --------------------------------------- |
| ** Structure **  | `/api/v1/user/{user-id}`                |
| ** Example **    | `/api/v1/user/65b038be6fe605cc9ce36df6` |

## Permissions

| Method          | Allow Acess                       |
| ----------------| ----------------------------------|
| student         | -                                 |
| uni-admin       | `/api/v1/user/{user-id}`          |
| sys-admin       | `/api/v1/user/{user-id}`          |

## Header Parameters

| Key                 | Type       | Required  | Description                                         |
| ------------------- | :--------: | :-------: | --------------------------------------------------- |
| Authorization       | string     | true      | Authorization JWT token in format of `Bearer <JWT>` |

## Path Parameters

| Key       | Type      | Required     | Permissions  | Description                          |
| --------- | :-------: | :----------: | :----------: | ------------------------------------ |
| user-id   | string    | true         |              | a user ID which would like to delete |

## Query Parameters

| Key       | Type      | Required     | Permissions  | Description                     |
| --------- | :-------: | :----------: | :----------: | ------------------------------- |
|           |           |              |              |                                 |

## Body Parameters

| Key          | Type         | Required     | Description                              |
| ------------ | :----------: | :----------: | ---------------------------------------- |
|              |              |              |                                          |


## Success Response 204 - No content

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
