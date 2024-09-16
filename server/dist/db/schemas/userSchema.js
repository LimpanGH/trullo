import { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList, GraphQLID } from 'graphql';
import UserModel from '../models/userModels';
const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
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
            resolve(parent, args) {
                const user = new UserModel({
                    name: args.name,
                    email: args.email,
                    password: args.password,
                });
                return user.save();
            },
        },
    },
});
export const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});
