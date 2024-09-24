// Defining rules using graphql-shield.

console.log(' Nu körs userPermissions.ts');

import { rule, shield } from 'graphql-shield';
import { UserModel } from '../models/userModels';
import schemaWithPermissions from '../permissions/userSchemaWithPermissions';


const isAuthenticated = rule()((parent, args, context) => {
  console.log(context.user);
  console.log(context);  
  console.log(args);
  console.log(parent);
  return context.user
    ? true
    : new Error('Authentication failed: You must be logged in to perform this action.');
});

// const isAdmin = rule({ cache: 'contextual' })(async (parent, args, context, info) => {
//   return context.user.role === 'admin'
// })

const isEmailValid = rule()((parent, args, context) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(args.email) ? true : new Error('Invalid email');
});

export const userPermissions = shield({
  RootQueryType: {
    user: isAuthenticated,
    users: isAuthenticated,
    // users: {isAuthenticated, isAdmin},
    task: isAuthenticated,
  },
  Mutation: {
    addUser: isEmailValid,
    deleteUser: isAuthenticated,
  },
});
