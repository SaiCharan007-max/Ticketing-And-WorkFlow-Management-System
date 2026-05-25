import AppError from "../utils/AppError.js";

export const authorizeRoles =
    (...allowedRoles) => {

    return (req, res, next) => {

        if (!req.userRole) {
            return next(
                new AppError(
                    401,
                    "Authentication required"
                )
            );
        }

        if (
            !allowedRoles.includes(req.userRole)
        ) {
            return next(
                new AppError(
                    403,
                    "Forbidden"
                )
            );
        }

        next();
    };
};