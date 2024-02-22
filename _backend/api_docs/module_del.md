# ** [PUT] Update a Module **

An admin can update a module and its fields using the module id.

## Request

| ** Method **     | DELETE                                            |
| ---------------- | ------------------------------------------------- |
| ** Structure **  | `/api/v1/module/{module-id}`      |
| ** Example **    | `/api/v1/module/65d1f4545a933936a166abbd` |

## Permissions

| Method          | Allow Acess                       |
| ----------------| ----------------------------------|
| student         | -                                 |
| uni-admin       | -                                 |
| sys-admin       | `/api/v1/module`                  |

## Header Parameters

| Key                 | Type       | Required  | Description                                         |
| ------------------- | :--------: | :-------: | --------------------------------------------------- |
| Authorization       | string     | true      | Authorization JWT token in format of `Bearer <JWT>` |

## Path Parameters

| Key               | Type      | Required     | Permissions  | Description                                    |
| ----------------- | :-------: | :----------: | :----------: | ---------------------------------------------- |
| module_id         | string    | true         |              | a module ID which would like to be retrieved  |

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
