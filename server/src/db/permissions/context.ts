// Here I define the Context object, which provides user information that can
// be accessed in resolvers and validation rules.

// I might create a custom.d.ts file in the types folder to define the AuthenticatedRequest
// interface instead of defining it here.
console.log(' Nu körs context.ts');

import { Request } from 'express';
import jwt from 'jsonwebtoken';

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

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'secret';

export const context = ({ req }: { req: AuthencicatedRequest }): Context => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log('No authorization header provided');
    return { user: undefined };
  }

  // const token = req.headers.authorization?.split(' ')[1];
  const token = authHeader.split(' ')[1];
  if (!token) {
    console.log('No token provided');
    return { user: undefined };
  }

  console.log('Token received', token);

  //   if (token) {
  //     try {
  //       const decoded = jwt.verify(token, SECRET_KEY) as { id: string; email: string };
  //       return { user: decoded };
  //     } catch (err) {
  //       console.log('Error in context', err);
  //     }
  //   }
  //   return { user: undefined };
  // };
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { id: string; email: string };
    console.log('Decoded JWT:', decoded);
    return { user: decoded };
  } catch (err) {
    console.log('Error verifying token:', err);
    return { user: undefined };
  }
};
