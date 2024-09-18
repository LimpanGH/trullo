// Mongoose

// - Schema: Describes the shape and rules of individual documents in a collection (validation,
//  types, defaults).

// - Model: The constructor function that provides an interface to interact with the MongoDB collection,
//  applying the schema's rules for each document.

// - By convention, we typically name schemas with a lowercase name (e.g., userSchema)
//   and models with an uppercase name (e.g., UserModel) to differentiate them,
//   but they are used together to manage your data in MongoDB.

import mongoose from 'mongoose';
import { TaskSchema, TaskModel } from '../models/taskModels';

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const UserModel = mongoose.model('User', UserSchema);

export { UserModel, TaskModel };
