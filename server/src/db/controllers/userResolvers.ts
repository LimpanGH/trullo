// Business logic for user queries and mutations

import { UserModel } from '../models/userModels';
import { TaskModel } from '../models/taskModels';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface LoginArgs {
  email: string;
  password: string;
}
interface UserArgs {
  id?: string;
}

interface AddUserArgs {
  name: string;
  email: string;
  password: string;
  id: string;
}

interface TaskArgs {
  id?: string;
}

interface UserParent {
  id: string;
}

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'mysecretkey';

const userResolvers = {
  Query: {
    user: (_: any, args: UserArgs) => {
      return UserModel.findById(args.id);
    },
    users: () => {
      return UserModel.find({});
    },
    task: (_: any, args: TaskArgs) => {
      return TaskModel.findById(args.id);
    },
  },
  User: {
    tasks: (parent: UserParent) => {
      return TaskModel.find({ assignedTo: parent.id });
    },
  },
  Mutation: {
    addUser: async (_: any, args: { [key: string]: any }) => {
      const { name, email, password } = args as AddUserArgs;
      
      const existingUser = await UserModel.findOne({ email  });
      if (existingUser) {
        throw new Error('User already exists with this email');
      } 

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(args.password, saltRounds);
      const user = new UserModel({
        name: args.name,
        email: args.email,
        password: hashedPassword,
      });
      return user.save();
    },

    // login: async (_: any, { email, password }: LoginArgs) => {
    login: async (_: any, args: { [key: string]: any }) => {
      const { email, password } = args as LoginArgs;

      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new Error('Invalid password');
      }

      const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, {
        expiresIn: '1d',

      });
      // return { token, user };
      return { token, user };
    },

    deleteUser: async (_: any, args: { [key: string]: any }) => {
      const { id } = args as UserArgs; // Cast args to UserArgs
      const deletedUser = await UserModel.findByIdAndDelete(args.id);
      return deletedUser;
    },
  },
};

export default userResolvers;
