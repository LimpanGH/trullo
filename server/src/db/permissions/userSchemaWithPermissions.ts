// Applying graphql-shield middleware to my schema.

import { applyMiddleware } from 'graphql-middleware';
import { schemaUser } from '../schemas/userSchema';
import { userPermissions } from './userPermissions';

// Apply middleware (graphql-shield) to your schema
const schemaWithPermissions = applyMiddleware(schemaUser, userPermissions);

export default schemaWithPermissions;
