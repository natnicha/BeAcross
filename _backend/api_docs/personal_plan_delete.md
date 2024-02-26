# ** [DELETE] Personal Plan **

Only students who added a module for a specific semster into a personal plan can delete that module from the plan

## Request

| ** Method **     | DELETE                                           |
| ---------------- | ------------------------------------------------ |
| ** Structure **  | `/api/v1/personal-plan/{personal_plan_id}`       |
| ** Example **    | `/api/v1/personal-plan/65a54de25eb0e12eb0a93e3a` |

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

| Key               | Type      | Required     | Permissions  | Description                                                                                       |
| ----------------- | :-------: | :----------: | :----------: | ------------------------------------------------------------------------------------------------- |
| personal_plan_id  | string    | true         | NULL         | a personal plan ID indicates a module that was added into a personal plan for a specific semester |

## Query Parameters

| Key       | Type      | Required     | Permissions  | Description                     |
| --------- | :-------: | :----------: | :----------: | ------------------------------- |
|           |           |              |              |                                 |

## Body Parameters

| Key               | Type         | Required     | Description                         |
| ----------------- | :----------: | :----------: | ----------------------------------- |
|                   |              |              |                                     |


## Sample Body Parameter Json Request
```json
{
  "personal_plan_id": "65a54de25eb0e12eb0a93e3a"
}
```


## Success Response 204 - No content
  [no request body]



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


## Error Response 404 - Not Found (case: not found a persoanl plan added by authenticated user)
```json
{
    "detail": {
        "message": "the module added into this user's personal plan is not found"
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
