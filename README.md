# Project Talker Manager

# Context
This is a Backend, CRUD project, simulating a panelists management with: talkers and a login route.

On this application it's possible to: 
  - GET talkers;
  - GET talkers based on: query, id and local db;
  - After login validation: POST, PUT, PATCH and DELETE talkers.

## Used technologies

Back-end:

> Developed using: Javascript, Docker, NodeJS, ExpressJS, MYSQL, Crypto

## Installing Dependencies

> After cloning the project

```bash
cd talker-manager
npm install
``` 
## Running the application with Docker
  
  ```
  docker compose up -d
  docker exec -it talker_manager bash
  ```
* Then run
  
  ```
  npm start
  ```
  > 'node'
  
  - or run
    
  ```
  npm run dev
  ```
  > 'nodemon'
## Running the application locally

  ```
  env $(cat .env) npm start
  ```
  > 'node'
  
  - or run
    
  ```
  env $(cat .env) npm run dev
  ```
  > 'nodemon'
