# ** [GET] Personal Plan **

Only student have a personal plan and therefore can get the plan regarding a given filter

## Request

| ** Method **     | GET                                                         |
| ---------------- | ----------------------------------------------------------- |
| ** Structure **  | `/api/v1/personal-plan?{filter}`                            |
| ** Example **    | `/api/v1/personal-plan?module_id=65aaafcf55de1fe16e64fdd3&` |

## Permissions

| Method          | Allow Acess                       |
| ----------------| --------------------------------- |
| guest           | -                                 |
| student         | `/api/v1/personal-plan?{filter}`  |
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
| module_id | string    | false        | NULL         | a condition uses to filter a personal plan by **module_id** e.x., &module_id=65aaafcf55de1fe16e64fdd3 |

## Body Parameters

| Key          | Type         | Required     | Description                               |
| ------------ | :----------: | :----------: | ----------------------------------------- |
|              |              |              |                                           |


## Success Response 200 - OK (case no filter, modules in a response will only show modules that were added for at least one semester in the personal plan.)
```json
{
  "data":{
    "total_items": 6,
    "items": [
      {
        "module_id": "65ac1847d2815b505f3e393d",
        "personal_plan": [
          {
            "personal_plan_id": "65d7adc92b35547c027a9d69",
            "semester_id": "65d7a7a22b35547c027a9d5b",
            "semester_name": "summer 2023",
            "is_added": true
          },
          {
            "personal_plan_id": null,
            "semester_id": "65d7a7bc2b35547c027a9d5c",
            "semester_name": "winter 2023/24",
            "is_added": false
          },
          {
            "personal_plan_id": "65d7ad2d2b35547c027a9d62",
            "semester_id": "65d7a7c42b35547c027a9d5d",
            "semester_name": "summer 2024",
            "is_added": true
          },
          {
            "personal_plan_id": "65dcb1e3b2983743c20462e7",
            "semester_id": "65d7a7cc2b35547c027a9d5e",
            "semester_name": "winter 2024/25",
            "is_added": true
          }
        ]
      },
      {
        "module_id": "65ac1847d2815b505f3e393e",
        "personal_plan": [
          {
            "personal_plan_id": null,
            "semester_id": "65d7a7a22b35547c027a9d5b",
            "semester_name": "summer 2023",
            "is_added": false
          },
          {
            "personal_plan_id": null,
            "semester_id": "65d7a7bc2b35547c027a9d5c",
            "semester_name": "winter 2023/24",
            "is_added": false
          },
          {
            "personal_plan_id": "65d7adaf2b35547c027a9d66",
            "semester_id": "65d7a7c42b35547c027a9d5d",
            "semester_name": "summer 2024",
            "is_added": true
          },
          {
            "personal_plan_id": null,
            "semester_id": "65d7a7cc2b35547c027a9d5e",
            "semester_name": "winter 2024/25",
            "is_added": false
          }
        ]
      }
      // ... more entries ...
    ]
  }
}
```

## Success Response 200 - OK (case module_id=65ac1847d2815b505f3e393d)
```json
{
  "data":{
    "total_items": 1,
    "items": [
      {
        "module_id": "65ac1847d2815b505f3e393d",
        "personal_plan": [
          {
            "personal_plan_id": "65d7adc92b35547c027a9d69",
            "semester_id": "65d7a7a22b35547c027a9d5b",
            "semester_name": "summer 2023",
            "is_added": true
          },
          {
            "personal_plan_id": null,
            "semester_id": "65d7a7bc2b35547c027a9d5c",
            "semester_name": "winter 2023/24",
            "is_added": false
          },
          {
            "personal_plan_id": "65d7ad2d2b35547c027a9d62",
            "semester_id": "65d7a7c42b35547c027a9d5d",
            "semester_name": "summer 2024",
            "is_added": true
          },
          {
            "personal_plan_id": "65dcb1e3b2983743c20462e7",
            "semester_id": "65d7a7cc2b35547c027a9d5e",
            "semester_name": "winter 2024/25",
            "is_added": true
          }
        ]
      }
    ]
  }
}
```

## Success Response 200 - OK (case no personal plan found)
```json
{
  "data":{
    "total_items": 0,
    "items": []
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
