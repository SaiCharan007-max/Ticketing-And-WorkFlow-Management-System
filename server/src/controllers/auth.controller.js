import { validationResult } from "express-validator";

import asyncHandler from "../utils/asyncHandler.js";

import * as authService from "../services/auth.service.js";

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
            await authService.registerUser({
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
            await authService.loginUser({
                email,
                password
            });

        return res.status(200).json({
            success: true,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            user: result.user
        });
    }
);

export const refreshToken = asyncHandler(
    async (req, res) => {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: "Refresh token is required"
            });
        }
        const result = await authService.refreshUserToken(refreshToken);
        if (!result) {
            return res.status(401).json({
                success: false,
                message: "Invalid refresh token"
            });
        }
        return res.status(200).json({
            success: true,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken
        });
    }
);

export const logoutUser = asyncHandler(
    async (req, res) => {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: "Refresh token is required"
            });
        }
        const result = await authService.logoutUser(refreshToken);
        if (!result) {
            return res.status(401).json({
                success: false,
                message: "Invalid refresh token"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    }
);


