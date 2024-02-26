# ** [GET] Semester **

every authenticated one can get semester within a system

## Request

| ** Method **     | GET                                                     |
| ---------------- | ------------------------------------------------------- |
| ** Structure **  | `/api/v1/semester?{limit}&{offset}&{sortby}&{orderby}`  |
| ** Example **    | `/api/v1/semester?sortby=name&orderby=desc`             |

## Permissions

| Method          | Allow Acess                                             |
| ----------------| ------------------------------------------------------- |
| guest           | -                                                       |
| student         | `/api/v1/semester?{limit}&{offset}&{sortby}&{orderby}`  |
| uni-admin       | `/api/v1/semester?{limit}&{offset}&{sortby}&{orderby}`  |
| sys-admin       | `/api/v1/semester?{limit}&{offset}&{sortby}&{orderby}`  |

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

| Key          | Type      | Required     | Default value | Description                                                 |
| ------------ | :-------: | :----------: | :-----------: | ----------------------------------------------------------- |
| limit        | int       | false        | 20            | a limitation of semesters in number                         |
| offset       | int       | false        | 0             | a starting position in the dataset of a particular record   |
| sortby       | string    | false        | id            | an entity referring how rows will be sorted in the response supports only `id`, `name` and `created_at` |
| orderby      | string    | false        | asc           | a sorting direction supports two values, either `asc` for ascending order, or `desc` for the reverse    |


## Body Parameters

| Key          | Type         | Required     | Description                               |
| ------------ | :----------: | :----------: | ----------------------------------------- |
|              |              |              |                                           |


## Success Response 200 - OK (case no filter, limit, offset, sortby, orderby)
```json
{
  "data":{
    "total_items": 4,
    "items": [
        {
            "id": "65d7a7a22b35547c027a9d5b",
            "name": "summer 2023",
            "created_at": "2024-01-18T20:21:41.138000",
        },
        {
            "id": "65d7a7bc2b35547c027a9d5c",
            "name": "winter 2023/24",
            "created_at": "2024-01-18T20:21:41.138001",
        },
        {
            "id": "65d7a7c42b35547c027a9d5d",
            "name": "summer 2024",
            "created_at": "2024-01-18T20:21:41.138002",
        },
        {
            "id": "65d7a7cc2b35547c027a9d5e",
            "name": "winter 2024/25",
            "created_at": "2024-01-18T20:21:41.138003",
        }
    ]
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
