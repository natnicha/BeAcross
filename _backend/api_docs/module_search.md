# ** [GET] Search Module **

To search modules using OWL ontology regarding a given term

## Request

| ** Method **     | GET                                                                |
| ---------------- | ------------------------------------------------------------------ |
| ** Structure **  | `/api/v1/module/search?{term}&{level}&{ects}&{university}&{type}&{limit}&{offset}&{orderby}&{order}`  |
| ** Example **    | `/api/v1/module/search?term=database&level=bachelor&level=master&ects=3&ects=6&university=Bialystok%20University%20Of%20Technology&type=elective&limit=100&offset=10&orderby=relevant&order=DESC` |

## Permissions

| Method          | Allow Acess                                                                                          |
| ----------------| ---------------------------------------------------------------------------------------------------- |
| student         | `/api/v1/module/search?{term}&{level}&{ects}&{university}&{type}&{limit}&{offset}&{orderby}&{order}` |
| uni-admin       | `/api/v1/module/search?{term}&{level}&{ects}&{university}&{type}&{limit}&{offset}&{orderby}&{order}` |
| sys-admin       | `/api/v1/module/search?{term}&{level}&{ects}&{university}&{type}&{limit}&{offset}&{orderby}&{order}` |

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
| level     | string    | false        | NULL          | a condition uses to filter modules by **module level** supoorts only `Bachelor`, `Master`, and `Doctoral`. In case of there are more than 1 conditions of level, repeatedly define level multiple times, e.x., &level=bachelor&level=master |
| ects      | int       | false        | NULL          | a condition uses to filter modules by **number of credits** supoorts only integer. In case of there are more than 1 conditions of ects, repeatedly define ects multiple times, e.x., &ects=3&ects=5  |
| university| string    | false        | NULL          | a condition uses to filter modules by **university name** supoorts only `Bialystok University Of Technology`, `Technische Universitat Chemnitz`, and `University of Nova Gorica`. In case of there are more than 1 conditions of university, repeatedly define university multiple times, e.x., &ects=Bialystok University Of Technology&ects=University of Nova GoricaBachelor |
| type      | string    | false        | NULL          | a condition uses to filter modules by **module type** supoorts only `Erasmus`, `Obiligitory`, and `Elective`In case of there are more than 1 conditions of type, repeatedly define type multiple times, e.x., &type=Obiligitory&type=elective |
| limit     | int       | false        | 20            | a limitation of module in number                            |
| offset    | int       | false        | 0             | a starting position in the dataset of a particular record   |
| sortby    | string    | false        | module-name   | an entity referring how rows will be sorted in the response supports only `module-name`, `no-of-recommend`, `offered-by`, `ect-credits`, `degree-level` and `year-of-study` |
| orderby   | string    | false        | asc           | a sorting direction supports two values, either `asc` for ascending order, or `desc` for the reverse  |

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
