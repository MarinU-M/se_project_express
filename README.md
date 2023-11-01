# WTWR (What to Wear?): Back End

This back-end project is focused on creating a server for the WTWR application.
It allows the front-end app to render clothes items and specific users, create new user and item, delete an item, and like/unlike items.
A user can check weather appropriate outfit using this app.

Authorization/authentication function is implemented using jsonwebtoken. Now, a user can login to the app and their data would be protected from other users' accesses. Email address and password is required in order to make brand new account.

In future, this backend will be connected to the [frontend](https://github.com/MarinU-M/se_project_react).

## Tools and Technologies

- JavaScript, node.js, Express
- MongoDB
- jsonwebtoken

- MongoDB Compass
- Postman
- VS Code

## Running the Project

`npm run start` — to launch the server

`npm run dev` — to launch the server with the hot reload feature
