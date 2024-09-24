// Apply middleware (graphql-shield) to my schema

console.log(' Nu körs taskSchemaWithPermissions.ts');

import { applyMiddleware } from 'graphql-middleware';
import { schemaTask } from '../schemas/taskSchema';
import { taskPermissions } from './taskPermissions';

const taskSchemaWithPermissions = applyMiddleware(
  schemaTask, // My existing task schema
  taskPermissions // My permission layer for tasks
);

export default taskSchemaWithPermissions;
