import { UserModel } from '../models/userModels';
import { TaskModel } from '../models/taskModels';
import bcrypt from 'bcrypt';
// import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;

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
      return { token, user };
    },

    addUser: async (_: any, args: { [key: string]: any }) => {
      const { name, email, password } = args as AddUserArgs;
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(args.password, saltRounds);
      const user = new UserModel({
        name: args.name,
        email: args.email,
        password: hashedPassword,
      });
      return user.save();
    },
    deleteUser: async (_: any, args: { [key: string]: any }) => {
      const { id } = args as UserArgs; // Cast args to UserArgs
      const deletedUser = await UserModel.findByIdAndDelete(args.id);
      return deletedUser;
    },
  },
};

export default userResolvers;
