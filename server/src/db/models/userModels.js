"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
var mongoose_1 = require("mongoose");
var UserSchema = new mongoose_1.default.Schema({
    name: String,
    email: String,
    password: String,
});
var UserModel = mongoose_1.default.model('User', UserSchema);
exports.UserModel = UserModel;
