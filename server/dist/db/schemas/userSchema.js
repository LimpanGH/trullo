import { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList, GraphQLID } from 'graphql';
import { UserModel, TaskModel } from '../models/userModels.js';
import { TaskType } from './taskSchema.js';
import bcrypt from 'bcrypt';
const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        tasks: {
            type: new GraphQLList(TaskType),
            resolve(parent, args) {
                return TaskModel.find({ assignedTo: parent.id });
                // return TaskModel.find({ assignedTo: args.assignedTo });
            },
        },
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
        deleteUser: {
            type: UserType,
            args: {
                id: { type: GraphQLID },
            },
            async resolve(parent, args) {
                const deletedUser = await UserModel.findByIdAndDelete(args.id);
                return deletedUser;
            },
        },
    },
});
export const schemaUser = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});
