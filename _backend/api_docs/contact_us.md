# ** [POST] Contact Us **

In order to contact Across administrators, use this API to send an email from Across web application directly to Victory Pie Solutions developer team for any purposes.

## Request

| ** Method **     | POST                              |
| ---------------- | ----------------------------------|
| ** Structure **  | `/contact-us`                     |
| ** Example **    | `/contact-us`                     |

## Permissions

| Method          | Allow Acess                       |
| ----------------| ----------------------------------|
| guest           | `/contact-us`                     |
| student         | `/contact-us`                     |
| uni-admin       | `/contact-us`                     |
| sys-admin       | `/contact-us`                     |

## Header Parameters

| Key                 | Type       | Required  | Description                                 |
| ------------------- | :--------: | :-------: | ------------------------------------------- |
| Content-Type        | string     | true      | Content-Type has to be `application/json`   |

## Path Parameters

| Key       | Type      | Required     | Permissions  | Description                     |
| --------- | :-------: | :----------: | :----------: | ------------------------------- |
|           |           |              |              |                                 |

## Query Parameters

| Key       | Type      | Required     | Permissions  | Description                     |
| --------- | :-------: | :----------: | :----------: | ------------------------------- |
|           |           |              |              |                                 |

## Body Parameters

| Key          | Type         | Required     | Description                                                     |
| ------------ | :----------: | :----------: | --------------------------------------------------------------- |
| name         | string       | true         | a contact person name                                           |
| email        | string       | true         | a user email identifing one's contact point regardless domains  |
| message      | string       | true         | a message expressing interests/objectives about anything        |

## Sample Body Parameter Json Request
```json
{
  "name": "John Doe",
  "email": "john.doe@tu-berlin.de",
  "message": "As a dean of machnical engineering at Technische Universitat Berline, I would like to summarize that our department would like join Across program."
}
```

## Success Response 200 - OK
```json
{
  "data": {
      "name": "John Doe",
      "email": "john.doe@tu-berlin.de",
      "message": "As a dean of machnical engineering at Technische Universitat Berline, I would like to summarize that our department would like join Across program."
  }
}
```

## Error Response 400 - Bad Request (case: email is invalid format)
```json
{
 "detail": { 
    "message": "Email is invalid format",
 }
}
```

## Error Response 422 - Unprocessable Entity (case: request body validation error)
```json
{
 "detail": { 
    "message": "Request body is invalid.",
 }
}
```

## Error Response 500 - Internal Server Error (case: server down)
```json
{
 "detail": { 
    "message" : "Server error",
 }
}
```

## Error Response 503 - Service Unavailable (case: Can't connect to 3rd party)
```json
{
 "detail": { 
    "message" : "Couldn't connect to third party",
 }
}
```
