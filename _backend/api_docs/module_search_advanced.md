# ** [GET] Search Module **

To advnaced search modules regarding given conditions

## Request

| ** Method **     | GET                                                                         |
| ---------------- | --------------------------------------------------------------------------- |
| ** Structure **  | `/api/v1/module/search/advanced?{term}&{limit}&{offset}&{sortby}&{orderby}` |
| ** Example **    | `/api/v1/module/search/advanced?term=("all%5Fmetadata":Database)AND("module%5Fname":SQL)NOT("content":Mongo)&limit=100&offset=10&sortby=degree_program&orderby=desc` |

## Permissions

| Method          | Allow Acess                                                                  |
| ----------------| ---------------------------------------------------------------------------- |
| student         | `/api/v1/module/search/advanced?{term}&{limit}&{offset}&{sortby}&{orderby}`  |
| uni-admin       | `/api/v1/module/search/advanced?{term}&{limit}&{offset}&{sortby}&{orderby}`  |
| sys-admin       | `/api/v1/module/search/advanced?{term}&{limit}&{offset}&{sortby}&{orderby}`  |

## Header Parameters

| Key                 | Type       | Required  | Description                                         |
| ------------------- | :--------: | :-------: | --------------------------------------------------- |
| Authorization       | string     | true      | Authorization JWT token in format of `Bearer <JWT>` |

## Path Parameters

| Key       | Type      | Required     | Permissions  | Description                     |
| --------- | :-------: | :----------: | :----------: | ------------------------------- |
|           |           |              |              |                                 |

## Query Parameters

| Key       | Type      | Required     |  Default Value  | Description                                                 |
| --------- | :-------: | :----------: | :-------------: | ----------------------------------------------------------- |
| term      | string    | true         |                 | a search term to acquire modules with conditions are stored in brackets and are connected to each others by operand word eg., `({cond-1}) Opr ({cond-2}) Opr ...`. The operand words (Opr) can only be `AND`, `OR` and `NOT`. The condition (Cond) must be in a format of `{metadata}:{search-terms}`. Metadata can only be `all_metadata`, `module_name`, `degree_program`, `degree_level`, `content`, `ects`, `university`,  and `module_type`. Note: Don't forget to replace special character with ACII in hex |
| limit     | int       | false        | 20              | a limitation number of results response                     |
| offset    | int       | false        | 0               | a starting position in the dataset of a particular record   |
| sortby    | string    | false        | module_name     | an entity referring how rows will be sorted in the response supports only `module_name`, `degree_program`, `no_of_recommend`, `no_of_suggested_modules`, `degree_level`, `ects`, `university`,  and `module_type` |
| orderby   | string    | false        | asc             | a sorting direction supports two values, either `asc` for ascending order, or `desc` for the reverse  |

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


## Error Response 404 - Not Found (case: no module not found for given conditions)
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
