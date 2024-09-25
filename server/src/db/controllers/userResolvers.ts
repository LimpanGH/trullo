console.log('Reading userResolvers.ts');

import { UserModel } from '../models/userModels';
import { TaskModel } from '../models/taskModels';
import bcrypt from 'bcrypt';
// import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;
// console.log(JWT_SECRET_KEY);

interface UserArgs {
  id?: string;
}

interface AddUserArgs {
  name: string;
  email: string;
  password: string;
}

interface TaskArgs {
  id?: string;
}

interface UserParent {
  id: string;
}

interface Context {
  user?: string | null;
}

const userResolvers = {
  Query: {
    getUserById: (_: any, args: UserArgs, context: Context) => {
      console.log('Context user:', context.user); // Log the context user
      if (!context.user) {
        throw new Error('Unauthorized, please add a valid token in the Authorization header');
      }

      if (!args.id) {
        throw new Error('User ID is required');
      }

      return UserModel.findById(args.id);
    },

    getAllUsers: (_: any, args: UserArgs, context: Context) => {
      console.log('Context user:', context.user); // Log the context user

      if (!context.user) {
        throw new Error('Unauthorized, please add a valid token in the Authorization header');
      }

      return UserModel.find({});
    },

    task: (_: any, args: TaskArgs, context: Context) => {
      if (!context.user) {
        throw new Error('Unauthorized, please add a valid token in the Authorization header');
      }
      return TaskModel.findById(args.id);
    },
  },

  User: {
    tasks: (parent: UserParent) => {
      return TaskModel.find({ assignedTo: parent.id });
    },
  },

  Mutation: {
    login: async (_: any, args: { [key: string]: any }) => {
      const { email, password } = args as AddUserArgs;
      const user = await UserModel.findOne({ email: email }).exec();
      if (!user) {
        throw new Error('No user with that email');
      }
      const valid = await bcrypt.compare(password, user.password as string);
      if (!valid) {
        throw new Error('Incorrect password');
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET_KEY, { expiresIn: '1h' });

      console.log('Users token is:', token);
      return { token, user };
    },

    addUser: async (_: any, args: { [key: string]: any }) => {
      const { name, email, password } = args as AddUserArgs;

      // Manual validation
      if (!email || email.trim() === '') {
        throw new Error('Email cannot be empty');
      }
      if (!password || password.trim() === '') {
        throw new Error('Password cannot be empty');
      }

      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(args.password, saltRounds);
      const user = new UserModel({
        name: args.name,
        email: args.email,
        password: hashedPassword,
      });
      console.log('New user added', { name: args.name, email: args.email });
      return user.save();
    },

    deleteUser: async (_: any, args: { [key: string]: any }, context: Context) => {
      const { id } = args as UserArgs; // Cast args to UserArgs
      console.log('Context user:', context.user); // Log the context user

      if (!context.user) {
        throw new Error(
          'Unauthorized to delete user. Please add a valid token in the Authorization header'
        );
      }

      const deletedUser = await UserModel.findByIdAndDelete(args.id);
      if (!deletedUser) {
        console.log('There is no user with ID:', args.id);
        throw new Error(`User with ID ${args.id} not found`);
      }

      console.log('User deleted:', { id: args.id, name: args.name, email: args.email });
      return deletedUser;
    },

    deleteMultipleUsers: async (_: any, args: { [key: string]: any }, context: Context) => {
      const { id } = args as UserArgs; // Cast args to UserArgs

      console.log('Context user:', context.user); // Log the context user

      if (!context.user) {
        throw new Error(
          'Unauthorized to delete user. Please add a valid token in the Authorization header'
        );
      }

      const deletedUsers = [];
      for (const id of args.ids) {
        const userToDelete = await UserModel.findById(id);
        if (!userToDelete) {
          console.log('There is no user with ID:', id);
          throw new Error(`User with ID ${id} not found`);
        }

        const deletedUser = await UserModel.findByIdAndDelete(id);
        deletedUsers.push(deletedUser);
      }

      console.log('Users deleted:', deletedUsers);
      return deletedUsers;
    },
  },
};

// console.log(userResolvers);

export default userResolvers;
