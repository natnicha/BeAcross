# ** [DELETE] Similarity between Modules **

A Similarity can be deleted between 2 modules

## Request

| ** Method **     | POST                              |
| ---------------- | ----------------------------------|
| ** Structure **  | `/api/v1/module/transferability`          |
| ** Example **    | `/api/v1/module/transferability`          |

## Permissions

| Method          | Allow Acess                       |
| ----------------| ----------------------------------|
| student         | -   |
| uni-admin       | -                                 |
| sys-admin       | -                                 |

## Header Parameters

| Key                 | Type       | Required  | Description                                         |
| ------------------- | :--------: | :-------: | --------------------------------------------------- |
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
| module_a    | string       | true          | a module ID to add simlarity to |
| module_b      | string       | true        | a module ID to define as similar to module_a|


## Sample Body Parameter Json Request
```json
{
  "module_a" : "65e460e4948a7c96dff468e0",
  "module_b": "65ac17b1d2815b505f3e352d"
}
```

## Success Response 200 - OK
```json
{
    "message": "Similarity is successfully deleted",
}
```


## Error Response 404 - Not Found (case: There is no similarity to delete)
```json
{
  "detail" : {
    "message": "Similarity does not Exist!"
  }
}
```

## Error Response 404 - Not Found (case: modules do not exists)
```json
{
  "detail" : {
    "message": "Module Not Found"
  }
}
```