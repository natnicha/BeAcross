# ** [GET] Recommend Module **

To get number of recommend for a specific module

## Request

| ** Method **     | GET                                                            |
| ---------------- | -------------------------------------------------------------- |
| ** Structure **  | `/api/v1/module/recommend/{module_id}`                         |
| ** Example **    | `/api/v1/module/recommend/?module_id=65a81c0502ed558ac053a095` |

## Permissions

| Method          | Allow Acess                       |
| ----------------| ----------------------------------|
| student         | `/api/v1/module/recommend`        |
| uni-admin       | `/api/v1/module/recommend`        |
| sys-admin       | `/api/v1/module/recommend`        |

## Header Parameters

| Key                 | Type       | Required  | Description                                         |
| ------------------- | :--------: | :-------: | --------------------------------------------------- |
| Authorization       | string     | true      | Authorization JWT token in format of `Bearer <JWT>` |

## Path Parameters

| Key       | Type      | Required     | Permissions  | Description                                            |
| --------- | :-------: | :----------: | :----------: | ------------------------------------------------------ |
| module_id | string    | true         |              | module ID that would like to get a number of recommend |

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
  "data" : {
    "no_of_recommend": 1
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
