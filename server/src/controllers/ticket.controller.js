import { createTicketWorkflow } from "../services/ticket.service.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createTicket = asyncHandler(async (
    req,
    res
) => {
    const {
        title,
        description,
        priority,
        categoryId
    } = req.body;

    const createdBy = req.userId;

    const createdTicket =
        await createTicketWorkflow({
            title,
            description,
            priority,
            categoryId,
            createdBy
        });

    res.status(201).json({
        success: true,
        ticket: createdTicket
    });
});