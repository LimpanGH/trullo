console.log('Reading taskSchema.ts');

import { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList, GraphQLID } from 'graphql';
import { TaskModel } from '../models/taskModels';
import { taskResolvers } from '../controllers/taskResolvers';
// import { title } from 'process';

export const TaskType = new GraphQLObjectType({
  name: 'Task',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    assignedTo: { type: GraphQLID },
    createdAt: { type: GraphQLString },
    finishedBy: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    task: {
      type: TaskType,
      args: {
        // id: { type: GraphQLID },
        // title: { type: GraphQLString },
        // description: { type: GraphQLString },
        // status: { type: GraphQLString },
        // assignedTo: { type: GraphQLString },
        // createdAt: { type: GraphQLString },
        // finishedBy: { type: GraphQLString },
      },
      resolve: taskResolvers.Query.task,
    },
    tasks: {
      type: new GraphQLList(TaskType),
      args: {
        assignedTo: { type: GraphQLID },
      },
      resolve(parent, args) {
        return TaskModel.find(args.assignedTo ? { assignedTo: args.assignedTo } : {});
      },
    },
  },
});

 const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addTask: {
      type: TaskType,
      args: {
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
        assignedTo: { type: GraphQLID },
      },
      resolve: taskResolvers.Mutation.addTask,
    },
    deleteTask: {
      type: TaskType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: taskResolvers.Mutation.deleteTask,
    }
  },
});

export const schemaTask = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
