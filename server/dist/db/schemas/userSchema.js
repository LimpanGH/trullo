console.log('Reading userSchema.ts');
import { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList, GraphQLID } from 'graphql';
import { TaskType } from './taskSchema.js';
import userResolvers from '../controllers/userResolvers.js';
export const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        // password: { type: GraphQLString },
        tasks: {
            type: new GraphQLList(TaskType),
            resolve: userResolvers.User.tasks,
        },
    }),
});
// console.log(UserType.getFields());
const LoginType = new GraphQLObjectType({
    name: 'Login',
    fields: {
        token: { type: GraphQLString },
        user: { type: UserType },
    },
});
// console.log(LoginType.getFields());
// const fields = LoginType.getFields();
// console.log(fields.token);
export const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        getUserById: {
            type: UserType,
            args: {
                id: { type: GraphQLID },
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                password: { type: GraphQLString },
            },
            resolve: userResolvers.Query.getUserById,
        },
        getAllUsers: {
            type: new GraphQLList(UserType),
            resolve: userResolvers.Query.getAllUsers,
        },
        getTaskByUserId: {
            type: new GraphQLList(TaskType),
            args: {
                id: { type: GraphQLID },
            },
            resolve: userResolvers.Query.getTaskByUserId,
        },
    },
});
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        login: {
            type: LoginType,
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
        deleteMultipleUsers: {
            type: new GraphQLList(UserType),
            args: {
                ids: { type: new GraphQLList(GraphQLString) },
            },
            resolve: userResolvers.Mutation.deleteMultipleUsers,
        },
    },
});
// console.log(RootQuery.getFields());
export const schemaUser = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});
