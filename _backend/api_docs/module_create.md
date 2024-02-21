# ** [POST] Module **

Both university and system administrators can add new modules by making a request with post method to a system with XML file in defined format.

## Request

| ** Method **     | POST                             |
| ---------------- | ---------------------------------|
| ** Structure **  | `/api/v1/module`                 |
| ** Example **    | `/api/v1/module`                 |

## Permissions

| Method          | Allow Acess                       |
| ----------------| ----------------------------------|
| guest           | -                                 |
| student         | -                                 |
| uni-admin       | `/api/v1/module`                  |
| sys-admin       | `/api/v1/module`                  |

## Header Parameters

| Key                 | Type       | Required  | Description                                         |
| ------------------- | :--------: | :-------: | --------------------------------------------------- |
| content-type        | string     | true      | Content-Type has to be `application/xml`            |
| Authorization       | string     | true      | Authorization JWT token in format of `Bearer <JWT>` |

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

| IMPORTANT: Attached files must be a valid XML! |
| --- |


## Sample XML attached file
```xml
<?xml version="1.0" encoding="UTF-8"?>
<data>
    <module>
        <module_name>Advanced Management of Data</module_name>
        <degree_program>Computer Science</degree_program>
        <degree_level>Master</degree_level>
        <university>Technische Universitat Chemnitz</university>
        <module_code>563100</module_code>
        <content>Content:Requirements for today's data management systems include scalability, continuous availability, frequent changes, location independence, the management of a wide ....</content>
        <ects>5</ects>
        <module_type>elective</module_type>
    </module>
    <module>
        <module_name>Artificial Intelligence for Data Analysis</module_name>
        <degree_program>Engineering and Management</degree_program>
        <degree_level>Master</degree_level>
        <university>Technische Universitat Chemnitz</university>
        <module_code>2GI018n</module_code>
        <content>AI-assisted data analysis is a process of discovering patterns and models, described by rules or other human- understandable representation formalisms...</content>
        <ects>6</ects>
        <module_type>elective</module_type>
    </module>
</data>
```


## Success Response 201 - Created
```json
{
  "data" : {
    "total_items": 20,
    "items": [
    {
      "module_id": "65ac17dfd2815b505f3e37b4",
      "module_name": "Data mining",
      "degree_program": "Data Science",
      "degree_level": "Master",
      "university": "Technische Universitat Chemnitz",
      "module_code": "W44",
      "content": "Content: Basics of data mining: definition, CRISP-DM, business areas of application of data mining, web mining and text mining Overview of the essential methods and technologies for evaluating and pattern recognition in data using appropriate methods Aim:The students will be able to evaluate structured data sets in a targeted manner using the available methods and technologies.",
      "ects": 5,
      "type": "elective"
    },
    {
      "module_id": "65ac17b1d2815b505f3e354b",
      "module_name": "Data security and cryptography",
      "degree_program": "Applied Computer Science",
      "degree_level": " Bachelor",
      "university": "Technische Universitat Chemnitz",
      "module_code": "543070",
      "content": "Content:Turing machines; predictability; NP completeness; classic and modern cryptographic methods; digital signatures; Hash functions Aim:Understanding aspects of the complexity of algorithmic problems and their importance for data security",
      "ects": 5,
      "type": "obligatory"
    },
    // ... more entries ...
    ]
  }
}
```

## Error Response 422 - Unprocessable Entity (case: mismatched tag in XML file)
```json
{
    "detail": {
        "message": "Expected tag not found or unexpected tag found. Please check you XML file tags",
        "hint": "mismatched tag: line 14, column 64"
    }
}
```

## Error Response 422 - Unprocessable Entity (case: mismatched tag in XML file)
```json
{
    "detail": {
        "message": "Expected tag not found or unexpected tag found. Please check you XML file tags",
        "hint": "mismatched tag: line 14, column 64"
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
