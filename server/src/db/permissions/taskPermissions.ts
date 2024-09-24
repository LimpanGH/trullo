// Validation

console.log(' Nu körs taskPermissions.ts');

import { rule, shield } from 'graphql-shield';
import { TaskModel } from '../models/taskModels';


const isAuthenticated = rule()((parent, args, context) => {
  return context.user ? true : new Error('Not authenticated');
});

const isTaskOwner = rule()(async (parent, args, context) => {
  const task = await TaskModel.findById(args.id); // Fetch the task from the database
  const taskId = args.id;

  return task?.assignedTo === context.user.id
    ? true
    : new Error('Not authorized to access this task');
});

export const taskPermissions = shield({
  RootQueryType: {
    task: isAuthenticated,
    tasks: isAuthenticated, // Allow listing of tasks only to authenticated users
  },
  Mutation: {
    addTask: isAuthenticated, // Allow task creation only to authenticated users
    deleteTask: isTaskOwner, // Only allow the owner to delete their task
  },
});
