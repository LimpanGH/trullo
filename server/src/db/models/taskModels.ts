import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: String,
  assignedTo: String,
  createdAt: Date,
  finishedBy: Date, //datum eller en kopplat till en person?
});

const TaskModel = mongoose.model('Task', TaskSchema);

export default TaskModel;
