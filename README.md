
# Typescript Kysely Starter




## Setup
Please take a look if you have not been working with [Kysely](https://kysely.dev/)

If this is your first time setup, Please make sure you already connect to database first. 

After that we gonna do some steps:

Install dependencies

```bash
  npm install
```

UP Kysely Migrations

```bash
  npm run up
```

Generate Kysely Typesafety

```bash
  npm run kysely
```

Seed initial database

```bash
  npm run seed
```


You can check on `package.json` for all command availables!


## Features

- Global Error Handler
- Modular Pattern (router, usecase, repository)
- Default Migration Example
- Seeder
- Audit Log Example
- ESLint Checker
- Rate Limit


## Folder Structure

The main source folder located in `src`. 

| Folder    | Description                |
| :-------- | :------------------------- |
| app       | Contains all features needed. It will group per features like index, router, usecase, and repository |
| const     | Place re-useable variables here. |
| db        | Contains database activity related like migrations, defining tables, etc |
| helper    | Place all function that often use in many places. | 
| types     | Defining global types if needed | 
| `index.ts` | Starting point where all setup, middleware, routing, and activity related to main apps happen | 




## Feedback

If you have any feedback, please feel free to reach out me at yudiananta.work@gmail.com



