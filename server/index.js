"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
// import dotenv from 'dotenv';
var dotenv = require("dotenv");
var mongoose_1 = require("mongoose");
var express_graphql_1 = require("express-graphql");
var userSchema_1 = require("./src/db/schemas/userSchema");
dotenv.config();
var app = (0, express_1.default)();
var mongodbUri = process.env.MONGODB_URI;
if (!mongodbUri) {
    throw new Error('MONGODB_URI is not defined in the environment variables.');
}
mongoose_1.default.connect(process.env.MONGODB_URI || '', {});
app.use('/graphql', (0, express_graphql_1.graphqlHTTP)({
    schema: userSchema_1.schema,
    graphiql: true,
}));
app.listen(3000, function () {
    console.log('Server is running on port 3000');
});
