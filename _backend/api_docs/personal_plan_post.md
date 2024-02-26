# ** [POST] Personal Plan **

Only students can add a module into their personal plan

## Request

| ** Method **     | POST                             |
| ---------------- | -------------------------------- |
| ** Structure **  | `/api/v1/personal-plan`          |
| ** Example **    | `/api/v1/personal-plan`          |

## Permissions

| Method          | Allow Acess                       |
| ----------------| --------------------------------- |
| guest           | -                                 |
| student         | `/api/v1/personal-plan`           |
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

| Key          | Type         | Required     | Description                                                                   |
| ------------ | :----------: | :----------: | ----------------------------------------------------------------------------- |
| module_id    | string       | true         | a module_id indicates a module to add into a personal plan                    |
| semester_id  | string       | true         | a semester_id indicates a which semester to add a module into a personal plan |


## Sample Body Parameter Json Request
```json
{
  "module_id": "65a54de25eb0e12eb0a93e3a",
  "semester_id": "65d7a7a22b35547c027a9d5b"
}
```


## Success Response 200 - OK
```json
{
  "personal_plan_id": "65a54de25eb0e12eb0a93e3a",
  "module_id": "65a54de25eb0e12eb0a93e3a",
  "semester_id": "65d7a7a22b35547c027a9d5b"
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


## Error Response 404 - Not Found (case: not found module ID)
```json
{
    "detail": {
        "message": "the module ID is not found"
    }
}
```


## Error Response 404 - Not Found (case: not found semester ID)
```json
{
    "detail": {
        "message": "the semester ID is not found"
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
