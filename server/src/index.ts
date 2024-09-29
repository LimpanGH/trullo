console.log('Reading index.ts');

import express from 'express';
import { Request, Response, NextFunction } from 'express';

import * as dotenv from 'dotenv';
import { connectToDB } from './db/dbConnect';
import { graphqlHTTP } from 'express-graphql';
import { schemaUser } from './db/schemas/userSchema';
import { schemaTask } from './db/schemas/taskSchema';
import { mergeSchemas } from '@graphql-tools/schema';
import jwt from 'jsonwebtoken';

dotenv.config();
const mongodbUri = process.env.MONGODB_URI;
const port = process.env.PORT;

const app = express();
app.use(express.json());

if (!mongodbUri) {
  throw new Error('MONGODB_URI is not defined in the environment variables.');
}
if(!process.env.JWT_SECRET_KEY) {
  throw new Error('JWT_SECRET_KEY is not defined in the environment variables.');
} 

connectToDB(mongodbUri);

const schema = mergeSchemas({
  schemas: [schemaUser, schemaTask],
});

app.use(
  '/graphql',
  graphqlHTTP((req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

    let decodedToken = null;
    if (token) {
      try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY || '');
      } catch (err) {
        console.log('Invalid or expired token');
      }
    }

    return {
      schema: schema,
      graphiql: true,
      // context: { user: decodedToken || null},
      context: { user: decodedToken },
    };
  })
);

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
