import express from 'express';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import { graphqlHTTP } from 'express-graphql';
import { schema } from './db/schemas/userSchema';
dotenv.config();
const app = express();
const mongodbUri = process.env.MONGODB_URI;
const port = process.env.PORT;
if (!mongodbUri) {
    throw new Error('MONGODB_URI is not defined in the environment variables.');
}
console.log('Connecting to MongoDB URI:', mongodbUri);
mongoose
    .connect(mongodbUri || '', {})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('MongoDB connection error', err));
mongoose.connection.on('connected', () => {
    console.log('Mongoose is connected to', mongodbUri);
});
mongoose.connection.on('error', (err) => {
    console.log('Mongoose connection error', err);
});
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose is disconnected');
});
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,
}));
app.listen(4000, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
