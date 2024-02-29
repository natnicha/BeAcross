# ** [GET] Suggested Modules **

Anyone can get suggested modules by a given module ID

## Request

| ** Method **     | DELETE                                              |
| ---------------- | --------------------------------------------------- |
| ** Structure **  | `/api/v1/module/{module-id}/suggested`              |
| ** Example **    | `/api/v1/module/65ac1847d2815b505f3e393d/suggested` |

## Permissions

| Method          | Allow Acess                            |
| ----------------| -------------------------------------- |
| guest           | `/api/v1/module/{module-id}/suggested` |
| student         | `/api/v1/module/{module-id}/suggested` |
| uni-admin       | `/api/v1/module/{module-id}/suggested` |
| sys-admin       | `/api/v1/module/{module-id}/suggested` |

## Header Parameters

| Key                 | Type       | Required  | Description                                         |
| ------------------- | :--------: | :-------: | --------------------------------------------------- |
|                     |            |           |                                                     |

## Path Parameters

| Key               | Type      | Required     | Permissions  | Description                                            |
| ----------------- | :-------: | :----------: | :----------: | ------------------------------------------------------ |
| module_id         | string    | true         |              | a module ID which would like to get suggested modules  |

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
        "requested_module_id":  "65ac17dfd2815b505f3e37b4",
        "total_suggested_module_items": 8,
        "suggested_module_items": [
            {
                "id": "65ac1847d2815b505f3e393d",
                "name": "*Contemporary cosmology",
                "content": "The goal of this course is to give the student a solid background in the physics of the universe and it's evolution and to introduce topics at the forefront of current research such as dark matter, dark energy and large-scale structure formation. / Homogeneous cosmology: • Kinematics of the Universe and • Dynamics of the Expansion Early Universe: • inflation • cosmic neutrino background, • big bang nucleosynthesis and • recombination Cosmological perturbations: • statistics of random Gaussian fields • initial perturbation generation linear evolution of fluctuations and matter power spectrum • CMB • Non-linear evolution and N-body simulations • Lyman –alpha and 21 cm as cosmological probes • Dark matter and dark energy Knowledge and understanding: Students will cover several topics in modern cosmology, such as: thermal history of the universe, and cosmological perturbations. Steven Weinberg, Cosmology, Oxford University Press, 2008 E-version Scott Dodelson, Modern Cosmology, Elsevier, 2003 E-version Oral seminar (100%) Gabrijela Zaharijas is an associate professor of Physics at the University of Nova Gorica and works within the Fermi LAT and CTA collaborations.",
                "program": null,
                "university": "University of Nova Gorica",
                "degree_program": " Physics",
                "module_code": "3FIi13n",
                "ects": 12,
                "degree_level": "Doctoral",
                "url": "https://www.ung.si/en/schools/graduate-school/programmes/3FI/2023/3FIi13n/2023/",
                "type": null
            },
            // ... more entries ...
        ]
    }
}
```

## Error Response 404 - Not Found (case: no suggested module found by provided id)
```json
{
    "detail": {
        "message": "No suggested module found"
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
