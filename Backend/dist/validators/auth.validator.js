"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogin = exports.validateRegister = void 0;
const validateRegister = (req, res, next) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.status(400).json({
            success: false,
            message: "All fields are required",
        });
        return;
    }
    next();
};
exports.validateRegister = validateRegister;
const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({
            success: false,
            message: "Email and Password are required",
        });
        return;
    }
    next();
};
exports.validateLogin = validateLogin;
