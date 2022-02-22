# node-typeorm-api

Backend application using node.js, typescript, typeORM and postgres.

## Concept

API responsible for managing a user's task list.

## features

- Create task (description, hour and date of creation and deadline).
- Edit task (description and deadline).
- End task (save hour and date and status).
- Save hour and date of updates in task.
- A completed task cannot be changed.
- show the paginated task list, being able to choose how many items at a time and whether I want to go forward or backward in the list of items.

## Installation

- You need to create database in `postgreSQL` with `YOUR_DATABASE_NAME`
- `git clone https://github.com/luisrodrigoads/tasks-api.git`
- `cd tasks-api`
- `npm install`
- create `ormconfig.json` based on your database

```json
{
    "type": "postgres",
    "host": "localhost",
    "port": 5432,
    "username": "YOUR_USER_NAME",
    "password": "YOUR_PASSWORD",
    "database": "YOUR_DATABASE_NAME",
    "entities": ["src/entity/*.ts"],
    "logging": true,
    "synchronize": true  
}
```

- `npm start`

## Routes 

- GET `localhost:3000/tasks/:currentPage/:tasksPerPage` , show tasks.
- POST `localhost:3000/tasks/` , create task. 

```json
{
    "description":"description task example",
    "deadline_at":"2022-02-25T23:18:19"
}
```
- PUT `localhost:3000/tasks/:id`, update task (deadline_at and/or description).
- PUT `localhost:3000/tasks/end/:id` , end task.
- DELETE `localhost:3000/tasks/:id` , delete task.