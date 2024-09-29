console.log('Reading taskResolvers.ts');

import { TaskModel } from '../models/taskModels';
import { checkAuth } from '../helpers/authHelpers';

interface TaskArgs {
  id?: string;
}
interface AddTaskArgs {
  id: string;
}

interface Context {
  user?: string | null;
}

interface AssignedTasksArgs {
  assignedTo?: string;
}

export const taskResolvers = {
  Query: {
    getTaskByTaskId: async (_: any, args: TaskArgs, context: Context) => {
      checkAuth(context);
      if (!args.id || typeof args.id !== 'string' || args.id.trim() === '') {
        throw new Error('Task ID is required and must be a non-empty string');
      }
      const task = await TaskModel.findById(args.id);
      if (!task) {
        throw new Error(`Task with ID ${args.id} not found`);
      }
      return TaskModel.findById(args.id);
    },

    getAllTasks: async (_: any, args: TaskArgs, context: Context) => {
      checkAuth(context);
      const tasks = await TaskModel.find({});
      if (tasks.length === 0) {
        throw new Error('No tasks found in the database');
      }
      return TaskModel.find({});
    },

    getTasksAssignedToUserId: (_: any, args: AssignedTasksArgs, context: Context) => {
      checkAuth(context);
      if (
        !args.assignedTo ||
        typeof args.assignedTo !== 'string' ||
        args.assignedTo.trim() === ''
      ) {
        throw new Error('User ID is required');
      }
      return TaskModel.find(args.assignedTo ? { assignedTo: args.assignedTo } : {});
    },
  },
  Mutation: {
    addTask: async (_: any, args: { [key: string]: any }, context: Context) => {
      console.log('Context user:', context.user); // Log the context user
      checkAuth(context);
      const task = new TaskModel({
        title: args.title,
        description: args.description,
        status: args.status,
        createdAt: new Date().toISOString(),
      });
      return task.save();
    },
    addTaskToUserId: async (_: any, args: { [key: string]: any }, context: Context) => {
      console.log('Context user:', context.user);
      checkAuth(context);
      if (!args.id) {
        throw new Error('User ID is required');
      }
      const task = new TaskModel({
        title: args.title,
        description: args.description,
        status: args.status,
        assignedTo: args.assignedTo,
        createdAt: new Date().toISOString(),
      });
      return task.save();
    },

    deleteTask: async (_: any, args: { [key: string]: any }, context: Context) => {
      checkAuth(context);
      const taskToDelete = await TaskModel.findById(args.id);
      if (!taskToDelete) {
        throw new Error(`Task with ID ${args.id} not found`);
      }
      const { id } = args as AddTaskArgs;
      const deletedTask = await TaskModel.findByIdAndDelete(args.id);
      return deletedTask;
    },
  },
};
