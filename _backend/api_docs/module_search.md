# ** [GET] Search Module **

To search modules using OWL ontology regarding a given term

## Request

| ** Method **     | GET                                                                |
| ---------------- | ------------------------------------------------------------------ |
| ** Structure **  | `/api/v1/module/search?{term}&{limit}&{offset}&{orderby}&{order}`  |
| ** Example **    | `/api/v1/module/search?term=database&limit=100&offset=10&orderby=relevant&order=DESC` |

## Permissions

| Method          | Allow Acess                                                        |
| ----------------| ------------------------------------------------------------------ |
| student         | `/api/v1/module/search?{term}&{limit}&{offset}&{orderby}&{order}`  |
| uni-admin       | `/api/v1/module/search?{term}&{limit}&{offset}&{orderby}&{order}`  |
| sys-admin       | `/api/v1/module/search?{term}&{limit}&{offset}&{orderby}&{order}`  |

## Header Parameters

| Key                 | Type       | Required  | Description                                         |
| ------------------- | :--------: | :-------: | --------------------------------------------------- |
| Authorization       | string     | true      | Authorization JWT token in format of `Bearer <JWT>` |

## Path Parameters

| Key       | Type      | Required     | Permissions  | Description                     |
| --------- | :-------: | :----------: | :----------: | ------------------------------- |
|           |           |              |              |                                 |

## Query Parameters

| Key       | Type      | Required     | Default Value | Description                                                 |
| --------- | :-------: | :----------: | :-----------: | ----------------------------------------------------------- |
| term      | string    | true         |               | a search term to acquire modules                            |
| limit     | int       | false        | 20            | a limitation number of module                               |
| offset    | int       | false        | 0             | a starting position in the dataset of a particular record   |
| sortby    | string    | false        | module-name   | an entity referring how rows will be sorted in the response supports only `module-name`, `offered-by`, `ect-credits`, `degree-level` and `semester` |
| orderby   | string    | false        | ASC           | a sorting direction supports two values, either `asc` for ascending order, or `desc` for the reverse  |

## Body Parameters

| Key          | Type         | Required     | Description                               |
| ------------ | :----------: | :----------: | ----------------------------------------- |
|              |              |              |                                           |


## Success Response 200 - OK
```json
{
  "data" : {
    "total_results": 76,
    "total_items": 20,
    "items": [{
      "module_id": "65a81c0502ed558ac053a095",
      "module_name": "Database and Object Orientation",
      "offered_by": "Chemnitz University of Technology",
      "ect_credits": 5.0,
      "degree_level": "Full-time Master",
      "semester": "Summer",
      "no_of_recommend": 213,
      "suggested_modules": 7,
    },
    {
      "module_id": "65a81c0502ed558ac053a096",
      "module_name": "Cloud & Web Application",
      "offered_by": "Chemnitz University of Technology",
      "ect_credits": 5.0,
      "degree_level": "Full-time Master",
      "semester": "Winter",
      "no_of_recommend": 89,
      "suggested_modules": 8,
    },
    // ... more entries ...
    ]
  }
}
```


## Error Response 404 - Not Found (case: no module not found for a given term)
```json
{
  "detail" : {
    "message": "no module found"
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
