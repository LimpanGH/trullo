console.log('Reading userResolvers.ts');

import bcrypt from 'bcrypt';
import { TaskModel } from '../models/taskModels';
import { UserModel } from '../models/userModels';
import { checkAuth } from '../helpers/authHelpers';
import mongoose from 'mongoose';
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
    getUserById: async (_: any, args: UserArgs, context: Context) => {
      console.log('Context user:', context.user); // Log the context user
      checkAuth(context);
      if (!args.id) {
        throw new Error('User ID is required');
      }
      const user = await UserModel.findById(args.id);
      if (!user) {
        throw new Error('No user with that ID in the database');
      }
      return user;
    },

    getAllUsers: async (_: any, args: UserArgs, context: Context) => {
      console.log('Context user:', context.user);
      checkAuth(context);
      const users = await UserModel.find({});
      if (users.length === 0) {
        throw new Error('No users found in the database');
      }
      return users;
    },

    getTaskByUserId: async (_: any, args: TaskArgs, context: Context) => {
      checkAuth(context);

      if (!args.id) {
        throw new Error('Task ID is required');
      }
      const tasks = await TaskModel.find({ assignedTo: args.id });
      if (!tasks || tasks.length === 0) {
        throw new Error(`No tasks found for user with ID:' ${args.id}`);
      }
      return tasks;
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
      const token = jwt.sign({ userId: user.id }, JWT_SECRET_KEY, { expiresIn: '3h' });
      console.log('Users token is:', token);
      return { token, user };
    },

    addUser: async (_: any, args: { [key: string]: any }, context: Context) => {
      const { name, email, password } = args as AddUserArgs;
      if (!context.user) {
        throw new Error(
          'Unauthorized to add user. Please add a valid token in the Authorization header'
        );
      }
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
      const { id } = args as UserArgs;
      console.log('Context user:', context.user);
      checkAuth(context);
      if (!id) {
        throw new Error('User ID is required.');
      }
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`Invalid ID format: ${id}`);
      }
      const deletedUser = await UserModel.findByIdAndDelete(id);
      if (!deletedUser) {
        console.log('There is no user with ID:', id);
        throw new Error(`User with ID ${id} not found`);
      }
      console.log('User deleted:', {
        id: deletedUser.id,
        name: deletedUser.name,
        email: deletedUser.email,
      });
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
