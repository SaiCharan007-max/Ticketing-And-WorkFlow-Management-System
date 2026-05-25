import { validationResult } from "express-validator";

import asyncHandler from "../utils/asyncHandler.js";

import {
    registerUser,
    loginUser
} from "../services/auth.service.js";

export const register = asyncHandler(
    async (req, res) => {

        const errors =
            validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const { email, password } =
            req.body;

        const result =
            await registerUser({
                email,
                password
            });

        return res.status(201).json({
            success: true,
            token: result.token,
            user: result.user
        });
    }
);

export const login = asyncHandler(
    async (req, res) => {

        const errors =
            validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const { email, password } =
            req.body;

        const result =
            await loginUser({
                email,
                password
            });

        return res.status(200).json({
            success: true,
            token: result.token,
            user: result.user
        });
    }
);