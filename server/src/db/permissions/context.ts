// Here I define the Context object, which provides user information that can
// be accessed in resolvers and validation rules.

import { Request } from 'express';

// I might create a custom.d.ts file in the types folder to define the AuthenticatedRequest
// interface instead of defining it here.
interface AuthencicatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export interface Context {
  user?: {
    id: string;
    email: string;
  };
}

export const context = ({ req }: { req: AuthencicatedRequest }): Context => {
  const user = req.user ? req.user : undefined;
  return { user };
};
