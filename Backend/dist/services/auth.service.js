"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const hashPassword_1 = __importDefault(require("../utils/hashPassword"));
const comparePassword_1 = __importDefault(require("../utils/comparePassword"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const registerUser = async (name, email, password) => {
    const existingUser = await prisma_1.default.user.findUnique({
        where: {
            email,
        },
    });
    if (existingUser) {
        throw new Error("User already exists");
    }
    const hashedPassword = await (0, hashPassword_1.default)(password);
    const user = await prisma_1.default.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });
    return {
        id: user.id,
        name: user.name,
        email: user.email,
    };
};
exports.registerUser = registerUser;
const loginUser = async (email, password) => {
    const user = await prisma_1.default.user.findUnique({
        where: {
            email,
        },
    });
    if (!user) {
        throw new Error("Invalid Credentials");
    }
    const isMatch = await (0, comparePassword_1.default)(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid Credentials");
    }
    const token = (0, generateToken_1.default)(user.id);
    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
    };
};
exports.loginUser = loginUser;
