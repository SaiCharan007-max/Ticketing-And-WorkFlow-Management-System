import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import pool from "../config/db.js";

import AppError from "../utils/AppError.js";

import {
    findUserByEmail,
    createUser
} from "../repositories/auth.repository.js";
import { getUserById } from "../repositories/user.repository.js";
import {
    createRefreshToken,
    findRefreshToken,
    deleteRefreshToken
} from "../repositories/refreshToken.repository.js";

const generateAccessToken = (user) => {

    return jwt.sign(
        {
            userId: user.id,
            userRole: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};

export const registerUser = async ({
    email,
    password
}) => {

    const existingUser =
        await findUserByEmail(email);

    if (existingUser) {
        throw new AppError(
            409,
            "Email already exists"
        );
    }

    const hashedPassword =
        await bcrypt.hash(password, 10);

    const createdUser =
        await createUser({
            email,
            hashedPassword
        });

    const token =
        generateAccessToken(createdUser);

    return {
        token,
        user: createdUser
    };
};

export const loginUser = async ({
    email,
    password
}) => {

    let client;

    try {

        client = await pool.connect();

        await client.query("BEGIN");

        const user =
            await findUserByEmail(email);

        if (!user) {
            throw new AppError(
                401,
                "Invalid email or password"
            );
        }

        const isMatch =
            await bcrypt.compare(
                password,
                user.password_hash
            );

        if (!isMatch) {
            throw new AppError(
                401,
                "Invalid email or password"
            );
        }

        const accessToken =
            generateAccessToken(user);

        const refreshToken =
            crypto
                .randomBytes(64)
                .toString("hex");

        const expiresAt =
            new Date(
                Date.now() +
                Number(
                    process.env
                        .REFRESH_TOKEN_EXPIRY
                ) *
                24 *
                60 *
                60 *
                1000
            );

        const createdRefreshToken =
            await createRefreshToken({
                client,
                token: refreshToken,
                userId: user.id,
                expiresAt
            });

        await client.query(
            "COMMIT"
        );

        return {
            accessToken,
            refreshToken:
                createdRefreshToken.token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        };

    } catch (err) {

        if (client) {
            await client.query(
                "ROLLBACK"
            );
        }

        throw err;

    } finally {

        if (client) {
            client.release();
        }
    }
};

export const refreshUserToken = async (
    token
) => {

    let client;

    try {

        client =
            await pool.connect();

        await client.query(
            "BEGIN"
        );

        const existingToken =
            await findRefreshToken({
                client,
                token
            });

        if (
            !existingToken ||
            existingToken.expires_at <
            new Date()
        ) {

            await client.query(
                "ROLLBACK"
            );

            return null;
        }

        const user =
            await getUserById(
                client,
                existingToken.user_id
            );

        if (!user) {

            await client.query(
                "ROLLBACK"
            );

            return null;
        }

        const accessToken =
            generateAccessToken(
                user
            );

        const newRefreshToken =
            crypto
                .randomBytes(64)
                .toString("hex");

        const expiresAt =
            new Date(
                Date.now() +
                Number(
                    process.env
                        .REFRESH_TOKEN_EXPIRY
                ) *
                24 *
                60 *
                60 *
                1000
            );

        await deleteRefreshToken({
            client,
            token:
                existingToken.token
        });

        const createdToken =
            await createRefreshToken({
                client,
                token:
                    newRefreshToken,
                userId:
                    user.id,
                expiresAt
            });

        await client.query(
            "COMMIT"
        );

        return {
            accessToken,
            refreshToken:
                createdToken.token
        };

    } catch (err) {

        if (client) {
            await client.query(
                "ROLLBACK"
            );
        }

        throw err;

    } finally {

        if (client) {
            client.release();
        }
    }
};

export const logoutUser =
    async (token) => {

        let client;

        try {

            client =
                await pool.connect();

            await client.query(
                "BEGIN"
            );

            await deleteRefreshToken({
                client,
                token
            });

            await client.query(
                "COMMIT"
            );

            return true;

        } catch (err) {

            if (client) {
                await client.query(
                    "ROLLBACK"
                );
            }

            throw err;

        } finally {

            if (client) {
                client.release();
            }
        }
    };
