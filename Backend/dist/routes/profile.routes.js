"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../middlware/auth.middleware"));
const profile_controller_1 = require("../controllers/profile.controller");
const profile_validator_1 = require("../validators/profile.validator");
const router = (0, express_1.Router)();
router.post("/", auth_middleware_1.default, profile_validator_1.validateProfile, profile_controller_1.createProfile);
router.get("/", auth_middleware_1.default, profile_controller_1.getProfile);
router.put("/", auth_middleware_1.default, profile_validator_1.validateProfile, profile_controller_1.updateProfile);
exports.default = router;
