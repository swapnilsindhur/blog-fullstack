"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogPut = exports.blogPost = exports.signinBody = exports.signupBody = void 0;
const zod_1 = require("zod");
exports.signupBody = zod_1.z.object({
    username: zod_1.z.string().email(),
    password: zod_1.z.string(),
    name: zod_1.z.string().optional()
});
exports.signinBody = zod_1.z.object({
    username: zod_1.z.string().email(),
    password: zod_1.z.string()
});
exports.blogPost = zod_1.z.object({
    title: zod_1.z.string(),
    content: zod_1.z.string()
});
exports.blogPut = zod_1.z.object({
    id: zod_1.z.number(),
    title: zod_1.z.string(),
    content: zod_1.z.string()
});
