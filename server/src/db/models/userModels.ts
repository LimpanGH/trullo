console.log('Reading userModels.ts');

import mongoose from 'mongoose';
import { TaskSchema, TaskModel } from '../models/taskModels';

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const UserModel = mongoose.model('User', UserSchema);

export { UserModel, TaskModel };
