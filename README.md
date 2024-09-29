## Trullo

### Description

This project is a GraphQL API built with Express and TypeScript, allowing for user management and task assignment. It features user authentication with JWT and includes multiple resolvers for handling user-related operations.

Technologies Used:

- Node.js: The JavaScript runtime for building the API.
- Express: A web application framework for Node.js.
- TypeScript: A superset of JavaScript that adds static typing.
- GraphQL: A query language for APIs.
- Mongoose: A library for MongoDB object modeling.
- Bcrypt: A library for hashing passwords.
- JWT: A method for securely transmitting information between parties.
- Express Validator: A set of middleware for validating and sanitizing user input.

### Getting Started

Prerequisites
Make sure you have the following installed:

- Node.js
- MongoDB
- Install the dependencies in server folder: `npm i`
- Create a .env file in the root directory and set the required environment variables, including:
  `JWT_SECRET_KEY=your_secret_key` and `MONGO_URI=your_mongodb_uri`
- Start the server: `npm run dev`

## Usage

### GraphQL Endpoints

- Login: Authenticate users and retrieve a JWT.
- User Operations: Create, delete, and retrieve users.
- Task Operations: Assign and retrieve tasks for users, delete tasks.

Sample Queries

Login:

```
mutation {
login(email: "user@example.com", password: "yourpassword") {
token
user {
id
name
email
}
}
}
```

Add User:

```
mutation {
addUser(name: "John Doe", email: "john@example.com", password: "securepassword") {
id
name
email
}
}
```

Delete Multiple Users:

```
mutation {
deleteMultipleUsers(ids: ["user_id_1", "user_id_2"]) {
id
name
email
}
}
```

### Headers

To include authorization headers in your GraphQL queries, add the following header in your client:

```
Authorization: Bearer <your_jwt_token>
```

# <span style="color: green;">Reasoning.</span>

### 1. Motivating my choice of database

I chose to build my project with MongoDB and GraphQL not because of the data-structure, but rather since I wanted to further explore these techniques. My understanding is that I will rather use SQL and REST in my early days as junior dev and therefore took the chance to dive deeper in Mongo and Graph before I move on.

### 2. Explain what the different technologies (eg tools, npm packages, etc.) do in the application

Dependencies

- @graphql-tools/schema: A utility for creating GraphQL schemas using the schema-first approach, allowing you to build your schema using SDL (Schema Definition Language) and resolvers.
- @types/bcrypt: TypeScript definitions for the bcrypt library, which allows you to use bcrypt in a TypeScript project with proper type checking.
- bcrypt: A library for hashing passwords. It provides a simple and effective way to hash and compare passwords securely.
- cors: Middleware for enabling Cross-Origin Resource Sharing (CORS) in your Express application, allowing your server to accept requests from different origins.
- dotenv: A zero-dependency module that loads environment variables from a .env file into process.env, allowing you to manage configuration settings without hardcoding them.
- express: A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
- express-graphql: Middleware for integrating GraphQL with an Express server, allowing you to create a GraphQL endpoint.
- express-validator: A set of middleware for validating and sanitizing user input in your Express application, helping to ensure data integrity and security.
- graphiql: An in-browser tool for exploring GraphQL APIs, providing an interactive environment for testing queries and mutations.
- graphql: The core GraphQL library, providing the necessary functionality to define GraphQL schemas, types, and operations.
- jsonwebtoken: A library for generating and verifying JSON Web Tokens (JWT), commonly used for authentication and information exchange.
- mongoose: An Object Data Modeling (ODM) library for MongoDB and Node.js, providing a schema-based solution to model your application data.

DevDependencies

- @types/cors: TypeScript definitions for the cors library, enabling type checking and IntelliSense for CORS middleware in TypeScript projects.
- @types/express: TypeScript definitions for the Express framework, allowing for type safety and improved development experience.
- @types/jsonwebtoken: TypeScript definitions for the jsonwebtoken library, enabling type checking and IntelliSense for JWT operations in TypeScript projects.
- @types/node: TypeScript definitions for Node.js, providing type definitions for built-in Node.js modules.
- replace-in-file: A utility for replacing text in files, commonly used in build processes or scripts to update configuration or code.
- ts-node: A TypeScript execution engine for Node.js, allowing you to run TypeScript files directly without compiling them to JavaScript first.
- tsx: A TypeScript execution environment similar to ts-node, providing support for modern TypeScript features and better performance.
- typescript: The TypeScript language itself, which adds static types to JavaScript, allowing for better tooling and error checking.

These libraries and frameworks work together to help me build, test, and maintain my GraphQL API effectively.

### 3. Briefly explain how the application works

#### Application Overview

Architecture:

- The application is built using Node.js and employs an Express framework to handle HTTP requests.
- It utilizes GraphQL as the API query language, allowing clients to request exactly the data they need.
- In my branch authGraphql-shield, one can observe my endeavors to build validation and authorization with GraphQL-Shield, but for some reason I never managed to pass the user-object to my context. It should work, but it doesn't. I did not want to switch to Apollo server and fall deeper in the rabbit hole, but rather stick to my guns. So I branched out from the latest version where all querys worked, and rebuilt validation and authorization with express-validator and som manual solutions.

Environment Variables:

- Configuration settings (like database connection strings and secret keys) are stored in a .env file and loaded using the dotenv library.

User Management:

- Users can be created, authenticated, and managed through various GraphQL mutations, such as addUser, login, deleteUser, and deleteMultipleUsers.
- Passwords are hashed using bcrypt before storing them in the database for security.

Database Interaction:

- Mongoose is used to model and interact with a MongoDB database, where user data and tasks are stored.
- The application defines Mongoose schemas for users and tasks to enforce data structure and validation.

GraphQL Schema:

- The GraphQL schema is defined with types for User, Login, and Task, specifying the shape of the data and the available queries and mutations.
- Resolvers handle the business logic for each query and mutation, fetching data from the database or performing actions like creating or deleting users.

  Authorization and Authentication:

- JWT (JSON Web Tokens) is used for user authentication. Upon logging in, a token is generated and returned to the client, which must be included in subsequent requests.
- The application checks for valid tokens to authorize actions, such as adding or deleting users.

Validation:

- The application uses express-validator to validate and sanitize user input, ensuring that only valid data is processed.

Development Tools:

- GraphiQL is integrated as an in-browser IDE for exploring and testing the GraphQL API, making it easier to interact with the backend. But I used ThunderClient for the most part because of the possibility to create collections, add JWT in header and write json bodies. However, the last week I have switched to Postman since it can retrieve and handle my GraphQl queries and mutations from the code, making it possible to take full use of the GraphQL environment features. The only downside I have experienced with Postman is that list arguments are not currently supported, so I had to test my mutation "deleteMultipleUsers" in ThunderClient.
  I used `tsx` to run the project without compiling, which speeded things up. I ran `build` to compile to my dist folder in addition to code in the file: fix-import-extensions.js for solving the problem with node.js not understanding imports from files.

Summary
Basically, my application provides a robust backend for managing users and tasks, using the power of GraphQL for flexible data querying, while ensuring security and data integrity through authentication, authorization, and input validation.
