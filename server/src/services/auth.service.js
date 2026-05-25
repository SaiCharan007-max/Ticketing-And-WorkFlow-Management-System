import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import AppError from "../utils/AppError.js";

import {
    findUserByEmail,
    createUser
} from "../repositories/auth.repository.js";

const generateToken = (user) => {

    return jwt.sign(
        {
            userId: user.id,
            userRole: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
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
        generateToken(createdUser);

    return {
        token,
        user: createdUser
    };
};

export const loginUser = async ({
    email,
    password
}) => {

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

    const token =
        generateToken(user);

    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role
        }
    };
};