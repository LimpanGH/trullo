import { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList, GraphQLID } from 'graphql';

import { UserModel, TaskModel } from '../models/userModels';
import bcrypt from 'bcrypt';

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  }),
});

const TaskType = new GraphQLObjectType({
  name: 'Task',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    assignedTo: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    finishedBy: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(args) {
        return UserModel.findById(args.id);
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve() {
        return UserModel.find({});
      },
    },
    task: {
      type: TaskType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(args) {
        return TaskModel.findById(args.id);
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      async resolve(parent, args) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(args.password, saltRounds);
        const user = new UserModel({
          name: args.name,
          email: args.email,
          password: hashedPassword,
        });
        return user.save();
      },
    },
  },
});

export const schemaUser = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
