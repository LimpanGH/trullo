import { applyMiddleware } from 'graphql-middleware';
import { schemaTask } from '../schemas/taskSchema';
import { taskPermissions } from './taskPermissions';

// Apply middleware (graphql-shield) to my schema
const schemaWithTaskPermissions = applyMiddleware(
  schemaTask, // My existing task schema
  taskPermissions // My permission layer for tasks
);

export default schemaWithTaskPermissions;
