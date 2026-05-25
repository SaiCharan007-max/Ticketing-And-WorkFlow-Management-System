import AppError from "../utils/AppError.js";
import priorityValues from "../constants/priorityValues.js";

const validateCreateTicket = (
    req,
    res,
    next
) => {

    const {
        title,
        priority,
        categoryId
    } = req.body;

    if (
        !title ||
        typeof title !== "string" ||
        !title.trim()
    ) {
        throw new AppError(
            400,
            "Valid title is required"
        );
    }

    if (
        typeof categoryId !== "number"
    ) {
        throw new AppError(
            400,
            "Valid categoryId is required"
        );
    }

    if (priority) {

        if (
            typeof priority !== "string"
        ) {
            throw new AppError(
                400,
                "Invalid priority type"
            );
        }

        if (
            !priorityValues.includes(priority)
        ) {
            throw new AppError(
                400,
                "Invalid priority value"
            );
        }
    }

    next();
};

export default validateCreateTicket;