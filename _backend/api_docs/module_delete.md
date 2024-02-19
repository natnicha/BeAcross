# ** [DELETE] a Module **

An admin can delete a module using module_id

## Request

| ** Method **     | DELETE                                            |
| ---------------- | ------------------------------------------------- |
| ** Structure **  | `/api/v1/module/{module_id}`      |
| ** Example **    | `/api/v1/module/65cbbc481a97c41f581cfc1c` |

## Permissions

| Method          | Allow Acess                       |
| ----------------| ----------------------------------|
| student         | -                                 |
| uni-admin       | `/api/v1/module`                  |
| sys-admin       | `/api/v1/module`                  |

## Header Parameters

| Key                 | Type       | Required  | Description                                         |
| ------------------- | :--------: | :-------: | --------------------------------------------------- |
| Authorization       | string     | true      | Authorization JWT token in format of `Bearer <JWT>` |

## Path Parameters

| Key               | Type      | Required     | Permissions  | Description                                    |
| ----------------- | :-------: | :----------: | :----------: | ---------------------------------------------- |
| module_id         | string    | true         |              | a module which would like to delete |

## Query Parameters

| Key       | Type      | Required     | Permissions  | Description                     |
| --------- | :-------: | :----------: | :----------: | ------------------------------- |
|           |           |              |              |                                 |

## Body Parameters

| Key          | Type         | Required     | Description                               |
| ------------ | :----------: | :----------: | ----------------------------------------- |
|              |              |              |                                           |


## Success Response 200 - OK
```json
{
    "detail": {
    "message": "Module is successfully deleted"
    }
}
```

## Error Response 400 - Bad Request (case: not a correct module id format)
```json
{
    "detail": {
        "message": "Invalid ObjectId format: 'abcd1234' is not a valid ObjectId, it must be a 12-byte input or a 24-character hex string"
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

## Error Response 403 - Unauthorized (case: user-role that is performing the request doesn't have the permission)
```json
{
  "detail" : {
    "message": "Not authorized to perform this action"
  }
}
```

## Error Response 404 - Not Found (case: no module found by this id)
```json
{
    "detail": {
        "message": "Module not found"
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
