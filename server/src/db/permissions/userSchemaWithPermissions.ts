// Applying graphql-shield middleware to my schema.

console.log(' Nu körs userSchemaWithPermissions.ts');

import { applyMiddleware } from 'graphql-middleware';
import { schemaUser } from '../schemas/userSchema';
import { userPermissions } from './userPermissions';

const userSchemaWithPermissions = applyMiddleware(schemaUser, userPermissions);

export default userSchemaWithPermissions;
