import { createTicketWorkflow } from "../services/ticket.service.js";

export const createTicket = async (
    req,
    res,
    next
) => {

    try {

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

    } catch (err) {

        next(err);
    }
};