# ** [POST] Register to auth **

## Request

| ** Method **     | POST                              |
| ---------------- | ----------------------------------|
| ** Structure **  | `/api/v1/auth/register`           |
| ** Example **    | `/api/v1/auth/register`           |

## Permissions

| Method          | Allow Acess                       |
| ----------------| ----------------------------------|
| guest           | `/api/v1/auth/register`           |

## Header Parameters

| Key                 | Type       | Required  | Description                                 |
| ------------------- | :--------: | :-------: | ------------------------------------------- |
| content-type        | string     | true      | Content-Type has to be `application/json`   |

## Path Parameters

| Key       | Type      | Required     | Permissions  | Description                     |
| --------- | :-------: | :----------: | :----------: | ------------------------------- |
|           |           |              |              |                                 |

## Query Parameters

| Key       | Type      | Required     | Permissions  | Description                     |
| --------- | :-------: | :----------: | :----------: | ------------------------------- |
|           |           |              |              |                                 |

## Body Parameters

| Key                  | Type           | Required     | Description                                                                                                |
| -------------------- | :------------: | :----------: | ---------------------------------------------------------------------------------------------------------- |
| email                | string(128)    | true         | a user email identifing one's university and is conformed by email format e.g., example@tu-chemnitz.de  |

## Sample Body Parameter Json Request
```json
{
  "email": "example@tu-chemnitz.de",
}
```

## Success Response 200 - OK
```json
{
  "message" : "Successful registered",
  "data": {}
}
```

## Error Response 400 - Bad Request (case: the email doesn't conform by email format)
```json
{
  "message" : "The email doesn't conform by email format, please input in format of example@university.de",
  "data": {}
}
```

## Error Response 400 - Bad Request (case: the email's domain (university) isn't under Across)
```json
{
  "message" : "The email's domain isn't under Across, please input another email which is under Across",
  "data": {}
}
```

## Error Response 400 - Bad Request (case: the email is aleady existed.)
```json
{
  "message" : "The email is already taken, please check again",
  "data": {}
}
```

## Error Response 422 - Unprocessable Entity (case: request body validation error)
```json
{
  "message": "Request body is invalid.",
  "data": {}
}
```

## Error Response 500 - Internal Server Error (case: server down)
```json
{
  "message" : "Server error",
  "data": {}
}
```

## Error Response 503 - Service Unavailable (case: Can't connect to 3rd party)
```json
{
  "message" : "Couldn't connect to third party",
  "data": {}
}
```
