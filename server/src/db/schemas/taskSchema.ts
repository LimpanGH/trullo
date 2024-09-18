import { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList, GraphQLID } from 'graphql';
import taskModel from '../models/taskModels';
// import { title } from 'process';

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
    task: {
      type: TaskType,
      args: {
        id: { type: GraphQLID },
        // title: { type: GraphQLString },
        // description: { type: GraphQLString },
        // status: { type: GraphQLString },
        // assignedTo: { type: GraphQLString },
        // createdAt: { type: GraphQLString },
        // finishedBy: { type: GraphQLString },
      },
      resolve(args) {
        return taskModel.findById(args.id);
      },
    },
    tasks: {
      type: new GraphQLList(TaskType),
      resolve() {
        return taskModel.find({});
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
        assignedTo: { type: GraphQLString },
      },
      resolve(parent, args) {
        const task = new taskModel({
          title: args.title,
          description: args.description,
          status: args.status,
          assignedTo: args.assignedTo,
          createdAt: new Date().toISOString(),
        });
        return task.save();
      },
    },
  },
});

export const schemaTask = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
