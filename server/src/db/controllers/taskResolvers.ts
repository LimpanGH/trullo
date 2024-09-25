console.log('Reading taskResolvers.ts');

// import { UserModel } from '../models/userModels';
import { TaskModel } from '../models/taskModels';

interface TaskArgs {
  id?: string;
}

interface AddTaskArgs {
  id: string;
}

interface Context {
  user?: string | null;
}

export const taskResolvers = {
  Query: {
    task: (_: any, args: TaskArgs, context: Context) => {
      if (!context.user) {
        throw new Error('Unauthorized');
      }
      return TaskModel.findById(args.id);
    },
    tasks: (_: any, args: TaskArgs, context: Context) => {
      if (!context.user) {
        throw new Error('Unauthorized');
      }
      return TaskModel.find({});
    },
  },
  Mutation: {
    addTask: async (_: any, context: Context, args: { [key: string]: any }) => {
      console.log('Context user:', context.user); // Log the context user

      if (!context.user) {
        throw new Error('Unauthorized');
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
    deleteTask: async (_: any, context: Context, args: { [key: string]: any }) => {
      if (!context.user) {
        throw new Error('Unauthorized');
      }

      const taskToDelete = await TaskModel.findById(args.id);
      if (!taskToDelete) {
        throw new Error(`Task with ID ${args.id} not found`);
      }

      const { id } = args as AddTaskArgs; // Cast args to AddTaskArgs
      const deletedTask = await TaskModel.findByIdAndDelete(args.id);
      return deletedTask;
    },
  },
};
