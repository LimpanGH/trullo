console.log('Reading taskModels.ts');

import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: Date,
  finishedBy: Date, //datum eller en kopplat till en person?
});

const TaskModel = mongoose.model('Task', TaskSchema);

export { TaskSchema, TaskModel };
