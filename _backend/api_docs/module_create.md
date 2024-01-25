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
| content-type        | string     | true      | Content-Type has to be `application/xml`           |
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


## Sample XML attached file
<!-- TODO -->

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
      "type": "elective",
      "similar_modules": [
        {
            "module_id": "65ac17b1d2815b505f3e354b",
            "module_name": "Data security and cryptography",
            "degree_program": "Applied Computer Science",
            "degree_level": " Bachelor",
            "university": "Technische Universitat Chemnitz",
            "module_code": "543070",
            "content": "Content:Turing machines; predictability; NP completeness; classic and modern cryptographic methods; digital signatures; Hash functions Aim:Understanding aspects of the complexity of algorithmic problems and their importance for data security",
            "ects": 5,
            "type": "obligatory",
        },
        {
            "module_id": "65ac17b1d2815b505f3e34c7",
            "module_name": "Basics of data mining & big data",
            "degree_program": "Business Intelligence & Analytics",
            "degree_level": " Master",
            "university": "Technische Universitat Chemnitz",
            "module_code": "1",
            "content": "Content:The aim of Module 1 is to impart basic knowledge in the areas of business intelligence and business analytics. The module offers students an overview of the essential methods and technologies for evaluation and pattern recognition in data using statistical methods. In addition, an overview of the challenges and solution approaches of managing big data, i.e. H. of large, polystructured data sets. Aim:Students acquire basic methodological and technology-specific knowledge and skills in the subject areas of “Business Intelligence” and “Business Analytics” for analyzing data in the company. You will be able to evaluate structured data in a targeted manner using the available methods and technologies. In addition, the students should get to know the possible uses and challenges of big data, gain a basic knowledge of the technologies and be able to assess the feasibility or possible applications in a business context. The main focus here is on the analysis of large, polystructured data sets.",
            "ects": 10,
            "type": "obligatory",
        },
        // ... more entries ...
      ]
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
      "type": "obligatory",
      "similar_modules": [
        {
            "module_id": "65ac17b1d2815b505f3e354b",
            "module_name": "Data security and cryptography",
            "degree_program": "Applied Computer Science",
            "degree_level": " Bachelor",
            "university": "Technische Universitat Chemnitz",
            "module_code": "543070",
            "content": "Content:Turing machines; predictability; NP completeness; classic and modern cryptographic methods; digital signatures; Hash functions Aim:Understanding aspects of the complexity of algorithmic problems and their importance for data security",
            "ects": 5,
            "type": "obligatory",
        },
        {
            "module_id": "65ac17b1d2815b505f3e34c7",
            "module_name": "Basics of data mining & big data",
            "degree_program": "Business Intelligence & Analytics",
            "degree_level": " Master",
            "university": "Technische Universitat Chemnitz",
            "module_code": "1",
            "content": "Content:The aim of Module 1 is to impart basic knowledge in the areas of business intelligence and business analytics. The module offers students an overview of the essential methods and technologies for evaluation and pattern recognition in data using statistical methods. In addition, an overview of the challenges and solution approaches of managing big data, i.e. H. of large, polystructured data sets. Aim:Students acquire basic methodological and technology-specific knowledge and skills in the subject areas of “Business Intelligence” and “Business Analytics” for analyzing data in the company. You will be able to evaluate structured data in a targeted manner using the available methods and technologies. In addition, the students should get to know the possible uses and challenges of big data, gain a basic knowledge of the technologies and be able to assess the feasibility or possible applications in a business context. The main focus here is on the analysis of large, polystructured data sets.",
            "ects": 10,
            "type": "obligatory",
        },
        // ... more entries ...
      ]
    },
    // ... more entries ...
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
