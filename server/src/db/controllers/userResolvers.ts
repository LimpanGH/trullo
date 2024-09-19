import { UserModel } from '../models/userModels';
import { TaskModel } from '../models/taskModels';
import bcrypt from 'bcrypt';

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
