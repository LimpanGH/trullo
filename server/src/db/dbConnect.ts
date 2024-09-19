import mongoose from 'mongoose';

import * as dotenv from 'dotenv';
dotenv.config();

const connectToMongoDB = async (mongodbUri: string) => {
  console.log('Connecting to MongDB URI', mongodbUri);
  try {
    await mongoose.connect(mongodbUri, {});
    console.log('Connected to MongoDB');

    mongoose.connection.on('connected', () => {
      console.log('Mongoose is connected to', mongodbUri);
    });
    mongoose.connection.on('error', (err) => {
      console.log('Mongoose connection error', err);
    });
    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose is disconnected');
    });
  } catch (err) {
    console.log('MongoDB connection error', err);
  }
};

export const connectToDB = connectToMongoDB;
