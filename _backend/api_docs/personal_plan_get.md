# ** [GET] Personal Plan **

Only student have a personal plan and therefore can get the plan regarding with or without a given filter

## Request

| ** Method **     | GET                                                         |
| ---------------- | ----------------------------------------------------------- |
| ** Structure **  | `/api/v1/personal-plan?{module_id}`                         |
| ** Example **    | `/api/v1/personal-plan?module_id=65aaafcf55de1fe16e64fdd3`  |

## Permissions

| Method          | Allow Acess                          |
| ----------------| ------------------------------------ |
| guest           | -                                    |
| student         | `/api/v1/personal-plan?{module_id}`  |
| uni-admin       | -                                    |
| sys-admin       | -                                    |

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
| module_id | string    | false        | NULL         | a condition uses to filter a personal plan by **module_id** e.x., &module_id=65aaafcf55de1fe16e64fdd3 |

## Body Parameters

| Key          | Type         | Required     | Description                               |
| ------------ | :----------: | :----------: | ----------------------------------------- |
|              |              |              |                                           |


## Success Response 200 - OK
```json
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
