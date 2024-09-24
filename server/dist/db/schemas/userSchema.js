import { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList, GraphQLID } from 'graphql';
import { TaskType } from './taskSchema.js';
import userResolvers from '../controllers/userResolvers.js';
export const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        token: { type: GraphQLString },
        // password: { type: GraphQLString }, Remove password from the schema for security reasons?
        tasks: {
            type: new GraphQLList(TaskType),
            resolve: userResolvers.User.tasks,
        },
    }),
});
const LoginPayloadType = new GraphQLObjectType({
    name: 'LoginPayload',
    fields: {
        token: { type: GraphQLString },
        user: { type: UserType },
    },
});
export const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: {
                id: { type: GraphQLID },
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                password: { type: GraphQLString },
                token: { type: GraphQLString },
            },
            resolve: userResolvers.Query.user,
        },
        users: {
            type: new GraphQLList(UserType),
            resolve: userResolvers.Query.users,
        },
        task: {
            type: TaskType,
            args: {
                id: { type: GraphQLID },
            },
            resolve: userResolvers.Query.task,
        },
    },
});
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        login: {
            type: LoginPayloadType,
            // type: new GraphQLObjectType({
            // name: 'LoginPayload',
            // fields: {
            //   token: { type: GraphQLString },
            //   user: { type: UserType },
            // },
            // }),
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString },
            },
            resolve: userResolvers.Mutation.login,
        },
        addUser: {
            type: UserType,
            args: {
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                password: { type: GraphQLString },
                token: { type: GraphQLString },
            },
            resolve: userResolvers.Mutation.addUser,
        },
        deleteUser: {
            type: UserType,
            args: {
                id: { type: GraphQLID },
            },
            resolve: userResolvers.Mutation.deleteUser,
        },
    },
});
export const schemaUser = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});
