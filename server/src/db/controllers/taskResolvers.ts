// Business logic for user queries and mutations

import { TaskModel } from '../models/taskModels';

interface TaskArgs {
  id?: string;
}

interface AddTaskArgs {
  id: string;
}

export const taskResolvers = {
  Query: {
    task: (_: any, args: TaskArgs) => {
      return TaskModel.findById(args.id);
    },
    tasks: (_: any, args: TaskArgs) => {
      return TaskModel.find({});
    },
  },
  Mutation: {
    addTask: async (_: any, args: { [key: string]: any }) => {
      const task = new TaskModel({
        title: args.title,
        description: args.description,
        status: args.status,
        assignedTo: args.assignedTo,
        createdAt: new Date().toISOString(),
      });
      return task.save();
    },
    deleteTask: async (_: any, args: { [key: string]: any }) => {
      const { id } = args as AddTaskArgs; // Cast args to AddTaskArgs
      const deletedTask = await TaskModel.findByIdAndDelete(args.id);
      return deletedTask;
    },
  },
};
