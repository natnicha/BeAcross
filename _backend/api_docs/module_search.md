# ** [GET] Search Module **

Anyone (guest, student, uni-admin, and sys-admin) can search modules regarding a given term, filter, limit, and offset

## Request

| ** Method **     | GET                                                                |
| ---------------- | ------------------------------------------------------------------ |
| ** Structure **  | `/api/v1/module/search?{term}&{degree_level}&{ects}&{university}&{module_type}&{limit}&{offset}&{sortby}&{orderby}`                                                                                              |
| ** Example **    | `/api/v1/module/search?term=database&level=bachelor&degree_level=master&ects=3&ects=6&university=Bialystok%20University%20Of%20Technology&module_type=elective&limit=100&offset=10&sortby=relevant&orderby=desc` |

## Permissions

| Method          | Allow Acess                                                                                                         |
| ----------------| ------------------------------------------------------------------------------------------------------------------- |
| guest           | `/api/v1/module/search?{term}&{degree_level}&{ects}&{university}&{module_type}&{limit}&{offset}&{sortby}&{orderby}` |
| student         | `/api/v1/module/search?{term}&{degree_level}&{ects}&{university}&{module_type}&{limit}&{offset}&{sortby}&{orderby}` |
| uni-admin       | `/api/v1/module/search?{term}&{degree_level}&{ects}&{university}&{module_type}&{limit}&{offset}&{sortby}&{orderby}` |
| sys-admin       | `/api/v1/module/search?{term}&{degree_level}&{ects}&{university}&{module_type}&{limit}&{offset}&{sortby}&{orderby}` |

## Header Parameters

| Key                 | Type       | Required  | Description                                         |
| ------------------- | :--------: | :-------: | --------------------------------------------------- |
|                     |            |           |                                                     |

## Path Parameters

| Key       | Type      | Required     | Permissions  | Description                     |
| --------- | :-------: | :----------: | :----------: | ------------------------------- |
|           |           |              |              |                                 |

## Query Parameters

| Key          | Type      | Required     | Default Value | Description                                                 |
| ------------ | :-------: | :----------: | :-----------: | ----------------------------------------------------------- |
| term         | string    | true         |               | a search term to acquire modules                            |
| degree_level | string    | false        | NULL          | a condition uses to filter modules by **degree_level** supoorts only `bachelor`, `master`, and `doctoral`. In case of there are more than 1 conditions of degree_level, repeatedly define degree_level multiple times, e.x., &degree_level=bachelor&degree_level=master |
| ects         | int       | false        | NULL          | a condition uses to filter modules by **ects** supoorts only integer. In case of there are more than 1 conditions of ects, repeatedly define ects multiple times, e.x., &ects=3&ects=5  |
| university   | string    | false        | NULL          | a condition uses to filter modules by **university** supoorts only `Bialystok University Of Technology`, `Technische Universitat Chemnitz`, and `University of Nova Gorica`. In case of there are more than 1 conditions of university, repeatedly define university multiple times, e.x., &university=Bialystok University Of Technology&university=University of Nova GoricaBachelor |
| module_type  | string    | false        | NULL          | a condition uses to filter modules by **module_type** supoorts only `Erasmus`, `obiligitory`, and `elective`. In case of there are more than 1 conditions of module_type, repeatedly define module_type multiple times, e.x., &module_type=obiligitory&module_type=elective |
| limit        | int       | false        | 20            | a limitation of module in number                            |
| offset       | int       | false        | 0             | a starting position in the dataset of a particular record   |
| sortby       | string    | false        | module_name   | an entity referring how rows will be sorted in the response supports only `module_name`, `degree_program`, `no_of_recommend`, `no_of_suggested_modules`, `degree_level`, `ects`, `university`, and `module_type` |
| orderby      | string    | false        | asc           | a sorting direction supports two values, either `asc` for ascending order, or `desc` for the reverse  |

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
    "items": [
    {
      "module_id": "65ac17dfd2815b505f3e37b4",
      "content": "Content: Basics of data mining: definition, CRISP-DM, business areas of application of data mining, web mining and text mining Overview of the essential methods and technologies for evaluating and pattern recognition in data using appropriate methods Aim:The students will be able to evaluate structured data sets in a targeted manner using the available methods and technologies.",
      "type": "elective",
      "university": "Technische Universitat Chemnitz",
      "degree_program": "Data Science",
      "module_code": "W44",
      "ects": 5,
      "degree_level": " \nMaster",
      "module_name": "Data mining",
      "no_of_recommend": 89,
      "no_of_suggested_modules": 10
    },
    {
      "module_id": "65ac17dfd2815b505f3e37e9",
      "content": "Content:Turing machines; predictability; NP completeness; classic and modern cryptographic methods; digital signatures; Hash functions Aim:Understanding aspects of the complexity of algorithmic problems and their importance for data security",
      "type": "obligatory",
      "university": "Technische Universitat Chemnitz",
      "degree_program": "Applied Computer Science",
      "module_code": "543070",
      "ects": 5,
      "degree_level": " Bachelor",
      "module_name": "Data security and cryptography",
      "no_of_recommend": 108,
      "no_of_suggested_modules": 6
    },
    // ... more entries ...
    ]
  }
}
```
Note: some fields in items may disappear depending on raw data.


## Error Response 404 - Not Found (case: No module not found for a given term)
```json
{
  "detail" : {
    "message": "No module found"
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
