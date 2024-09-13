import express from 'express';
// import dotenv from 'dotenv';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import { graphqlHTTP } from 'express-graphql';
import { schema } from './src/db/schemas/userSchema';

dotenv.config();

const app = express();

const mongodbUri = process.env.MONGODB_URI;
if (!mongodbUri) {
  throw new Error('MONGODB_URI is not defined in the environment variables.');
}

mongoose.connect(process.env.MONGODB_URI || '', {});

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
