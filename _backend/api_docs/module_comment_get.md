# ** [GET] Comment in a Module **

Anyone (guest, student, uni-admin, and sys-admin) can see all comments commented on each module

## Request

| ** Method **     | GET                                               |
| ---------------- | ------------------------------------------------- |
| ** Structure **  | `/api/v1/module/{module-id}/comment`              |
| ** Example **    | `/api/v1/module/65aa8b61329a5b7064db8eca/comment` |

## Permissions

| Method          | Allow Acess                          |
| ----------------| ------------------------------------ |
| guest           | `/api/v1/module/{module-id}/comment` |
| student         | `/api/v1/module/{module-id}/comment` |
| uni-admin       | `/api/v1/module/{module-id}/comment` |
| sys-admin       | `/api/v1/module/{module-id}/comment` |

## Header Parameters

| Key                 | Type       | Required  | Description                                         |
| ------------------- | :--------: | :-------: | --------------------------------------------------- |
| content-type        | string     | true      | Content-Type has to be `application/json`           |

## Path Parameters

| Key       | Type      | Required     | Permissions  | Description                     |
| --------- | :-------: | :----------: | :----------: | ------------------------------- |
|           |           |              |              |                                 |

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
  "module_id": "65a54de25eb0e12eb0a93e3a",
  "total_items": 3,
  "items": [
    {
      "id": "65aaafcf55de1fe16e64fdd3",
      "message": "this course is awesome!",
      "user": "ex***e",
      "created_at": "2024-01-19T16:16:21.023783",
      "updated_at": "2024-01-19T16:16:21.023783"
    },
    {
      "id": "65aaafcf55de1fe16e64fdd4",
      "message": "I do like this course. Really recommend if you are looking for database course. 😀👍🏻",
      "user": "sa***n",
      "created_at": "2024-01-01T16:16:21.023783",
      "updated_at": "2024-01-01T16:16:21.023783"
    }
    {
      "id": "65aaafcf55de1fe16e64fdd5",
      "message": "The best lecturer ever!! 😍",
      "user": "na***d",
      "created_at": "2024-01-01T16:16:21.023783",
      "updated_at": "2024-01-01T16:16:21.023783"
    }
    ]
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
