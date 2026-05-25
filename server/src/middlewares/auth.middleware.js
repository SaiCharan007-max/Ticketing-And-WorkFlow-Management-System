import jwt from "jsonwebtoken";

import AppError from "../utils/AppError.js";

const authMiddleware = (
    req,
    res,
    next
) => {

    try {

        const authHeader =
            req.headers.authorization;

        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {
            throw new AppError(
                401,
                "Authentication required"
            );
        }

        const token =
            authHeader.split(" ")[1];

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        req.userId =
            decoded.userId;

        req.userRole =
            decoded.userRole;

        next();

    } catch (err) {
        next(
            new AppError(
                401,
                "Invalid or expired token"
            )
        );
    }
};

export default authMiddleware;