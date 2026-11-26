"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const auth_service_1 = require("../services/auth.service");
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await (0, auth_service_1.registerUser)(name, email, password);
        res.status(201).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Something went wrong",
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await (0, auth_service_1.loginUser)(email, password);
        res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Something went wrong",
        });
    }
};
exports.login = login;
