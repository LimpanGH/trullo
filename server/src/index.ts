console.log(' Nu körs index.ts');
import express from 'express';
import * as dotenv from 'dotenv';
import { connectToDB } from './db/dbConnect';
import { graphqlHTTP } from 'express-graphql';
import { schemaUser } from './db/schemas/userSchema';
import { schemaTask } from './db/schemas/taskSchema';

import { userPermissions } from './db/permissions/userPermissions';
import { taskPermissions } from './db/permissions/taskPermissions';

import { mergeSchemas, makeExecutableSchema } from '@graphql-tools/schema';
import { applyMiddleware } from 'graphql-middleware';
import { context } from './db/permissions/context';
import taskSchemaWithPermissions from './db/permissions/taskSchemaWithPermissions';
import userSchemaWithPermissions from './db/permissions/userSchemaWithPermissions';

dotenv.config();
const mongodbUri = process.env.MONGODB_URI;
const port = process.env.PORT || 4000;

const app = express();
// app.use(express.json());


if (!mongodbUri) {
  throw new Error('MONGODB_URI is not defined in the environment variables.');
}

const mergedSchema = mergeSchemas({
  schemas: [schemaUser, schemaTask, userSchemaWithPermissions,taskSchemaWithPermissions],
  
});
console.log(mergedSchema.getQueryType());

const schemaWithPermissions = applyMiddleware(mergedSchema, userPermissions, taskPermissions);

try {
  connectToDB(mongodbUri);
} catch (error) {
  console.error('Failed connecting to the database: ', error);
}

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schemaWithPermissions,
    graphiql: true,
    context: context,
  })
);
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
