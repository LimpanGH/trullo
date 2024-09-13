"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
var graphql_1 = require("graphql");
var userModels_1 = require("../models/userModels");
var UserType = new graphql_1.GraphQLObjectType({
    name: 'User',
    fields: function () { return ({
        id: { type: graphql_1.GraphQLID },
        name: { type: graphql_1.GraphQLString },
        email: { type: graphql_1.GraphQLString },
        password: { type: graphql_1.GraphQLString },
    }); },
});
var RootQuery = new graphql_1.GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: {
                id: { type: graphql_1.GraphQLID },
                name: { type: graphql_1.GraphQLString },
                email: { type: graphql_1.GraphQLString },
                password: { type: graphql_1.GraphQLString },
            },
            resolve: function (parent, args) {
                return userModels_1.UserModel.findById(args.id);
            },
        },
        users: {
            type: new graphql_1.GraphQLList(UserType),
            resolve: function () {
                return userModels_1.UserModel.find({});
            },
        },
    },
});
var Mutation = new graphql_1.GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                name: { type: graphql_1.GraphQLString },
                email: { type: graphql_1.GraphQLString },
                pasword: { type: graphql_1.GraphQLString },
            },
            resolve: function (parent, args) {
                var user = new userModels_1.UserModel({
                    name: args.name,
                    email: args.email,
                    password: args.password,
                });
                return user.save();
            },
        },
    },
});
exports.schema = new graphql_1.GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});
