import express from 'express';
import * as dotenv from 'dotenv';
import { connectToDB } from './db/dbConnect.js';
import { graphqlHTTP } from 'express-graphql';
import { schemaUser } from './db/schemas/userSchema.js';
import { schemaTask } from './db/schemas/taskSchema.js';
import { userPermissions } from './db/permissions/userPermissions.js';
import { taskPermissions } from './db/permissions/taskPermissions.js';
import { mergeSchemas } from '@graphql-tools/schema';
import { applyMiddleware } from 'graphql-middleware';
import { context } from './db/permissions/context.js';
dotenv.config();
const mongodbUri = process.env.MONGODB_URI;
const port = process.env.PORT || 4000;
const app = express();
if (!mongodbUri) {
    throw new Error('MONGODB_URI is not defined in the environment variables.');
}
const mergedSchema = mergeSchemas({
    schemas: [schemaUser, schemaTask],
});
console.log(mergedSchema.getQueryType());
const schemaWithPermissions = applyMiddleware(mergedSchema, userPermissions, taskPermissions);
try {
    connectToDB(mongodbUri);
}
catch (error) {
    console.error('Failed connecting to the database: ', error);
}
app.use('/graphql', graphqlHTTP({
    schema: schemaWithPermissions,
    graphiql: true,
    context: context,
}));
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
