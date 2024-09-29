console.log('Reading taskSchema.ts');
import { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList, GraphQLID } from 'graphql';
import { taskResolvers } from '../controllers/taskResolvers.js';
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
        getTaskByTaskId: {
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
            resolve: taskResolvers.Query.getTaskByTaskId,
        },
        getAllTasks: {
            type: new GraphQLList(TaskType),
            resolve: taskResolvers.Query.getAllTasks,
        },
        getTasksAssignedToUserId: {
            type: new GraphQLList(TaskType),
            args: {
                assignedTo: { type: GraphQLID },
            },
            resolve: taskResolvers.Query.getTasksAssignedToUserId,
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
            },
            resolve: taskResolvers.Mutation.addTask,
        },
        addTaskToUserId: {
            type: TaskType,
            args: {
                title: { type: GraphQLString },
                description: { type: GraphQLString },
                status: { type: GraphQLString },
                assignedTo: { type: GraphQLID },
            },
            resolve: taskResolvers.Mutation.addTaskToUserId,
        },
        deleteTask: {
            type: TaskType,
            args: {
                id: { type: GraphQLID },
            },
            resolve: taskResolvers.Mutation.deleteTask,
        },
    },
});
export const schemaTask = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});
