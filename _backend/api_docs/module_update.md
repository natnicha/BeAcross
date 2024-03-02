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
| name         | string       | False        | The name of the module, that would be updated             |
| content      | string       | False        | The content of the module, that would be updated          |
| program      | string       | False        | The program of the module, that would be updated          |
| university   | string       | False        | The university of the module, that would be updated       |
| degree_program | string     | False        | The degree_program of the module, that would be updated   |
| module_code  | string       | False        | The code of the module, that would be updated             |
| ects         | integer      | False        | The ects of the module, that would be updated             |
| degree_level | string       | False        | The degree_level of the module, that would be updated     |
| url          | string       | False        | The url of the module, that would be updated              |
| type         | string       | False        | The type of the module, that would be updated             |

## Sample Body Parameter Json Request
```json
{
    "name":"Database",
    "content":"relational and non-relational database",
    "program":"Computer-Science",
    "university":"Technische Universitat Chemnitz",
    "module_code":"TUCCS-1234",
    "ects": 5,
}
```

## Success Response 200 - OK
```json
{
    "id": "65d1f4545a933936a166abbd",
    "name": "Database",
    "content": "relational and non-relational database",
    "program": "Computer-Science",
    "university": "Technische Universitat Chemnitz",
    "degree_program": "Informatik",
    "module_code": "TUCCS-1234",
    "ects": 5,
    "degree_level": "Master",
    "url": "https://www.tu-chemnitz.de/informatik/TUCCS-1234",
    "type": "TEST-type"
}
```

## Error Response 400 - Bad Request (case: the id format is incorrect)
```json
{
    "detail": {
        "message": "Invalid ObjectId format: '65d1f4545a933936a166abbd1234' is not a valid ObjectId, it must be a 12-byte input or a 24-character hex string"
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

## Error Response 403 - Forbidden (case: the user-role doesn't have permission to access this specific module)
```json
{
    "detail": {
        "message": "Not authorized to delete module from another university"
    }
}
```

## Error Response 404 - Not Found (case: the module with the requested id was not found to be updated)
```json
{
    "detail": {
        "message": "Module not found"
    }
}
```

## Error Response 404 - Not Found (case: the module that was just updated, cannot be fetched anymore )
```json
{
    "detail": {
        "message": "Module not found after update"
    }
}
```

## Error Response 422 - Unprocessable Entity (case: the body request is empty or incorrect)
```json
{
    "detail": [
        {
            "type": "missing",
            "loc": [
                "body"
            ],
            "msg": "Field required",
            "input": null,
            "url": "https://errors.pydantic.dev/2.5/v/missing"
        }
    ]
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
