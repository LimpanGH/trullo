import express from 'express';
import * as dotenv from 'dotenv';
import { connectToDB } from './db/dbConnect.js';
import { graphqlHTTP } from 'express-graphql';
import { schemaUser } from './db/schemas/userSchema.js';
import { schemaTask } from './db/schemas/taskSchema.js';
import { mergeSchemas } from '@graphql-tools/schema';
dotenv.config();
const mongodbUri = process.env.MONGODB_URI;
const port = process.env.PORT;
const app = express();
if (!mongodbUri) {
    throw new Error('MONGODB_URI is not defined in the environment variables.');
}
connectToDB(mongodbUri);
const schema = mergeSchemas({
    schemas: [schemaUser, schemaTask],
});
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,
}));
app.listen(4000, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
