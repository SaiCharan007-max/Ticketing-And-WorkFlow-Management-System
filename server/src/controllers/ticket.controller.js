import * as ticketService from "../services/ticket.service.js";

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
        await ticketService.createTicketWorkflow({
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

export const updateTicketStatus = asyncHandler(
    async (req, res) => {

        const ticketId = req.params.id;

        const { status } = req.body;

        const updatedTicket =
            await ticketService.updateTicketStatus({
                ticketId,
                status,
                userId: req.userId,
                userRole: req.userRole
            });

        res.status(200).json({
            success: true,
            ticket: updatedTicket
        });
    }
);

export const assignTicket = asyncHandler(
    async (req, res) => {

        const ticketId = req.params.id;

        const { assignedTo } = req.body;

        const updatedTicket =
            await ticketService.updateTicketAssignment({
                ticketId,
                assignedTo,
                assignedBy: req.userId
            });

        res.status(200).json({
            success: true,
            ticket: updatedTicket
        });
    }
);

export const getTicketById = asyncHandler(
    async (req, res) => {
        const ticket =
            await ticketService.getTicketById({
                ticketId: req.params.id,
                userId: req.userId,
                userRole: req.userRole
            });

        res.status(200).json({
            success: true,
            ticket
        });
    }
);

export const getAssignedTickets = asyncHandler(
    async (req, res) => {
        const tickets =
            await ticketService.getAssignedTickets(
                req.userId
            );

        res.status(200).json({
            success: true,
            tickets
        });
    }
);

export const getMyTickets = asyncHandler(
    async (req, res) => {

        const page = Number(req.query.page) || 1;
        const limit =
            Math.min(
                Number(req.query.limit) || 10,
                50
            );
        const status = req.query.status;
        const priority = req.query.priority;
        const sort = req.query.sort;
        const order = req.query.order;
        const search = req.query.search;

        const tickets =
            await ticketService.getMyTickets(
                { userId: req.userId, page, limit, status, priority, sort, order, search }
            );

        res.status(200).json({
            success: true,
            ...tickets
        });
    }
);

export const getTicketHistory = asyncHandler(
    async (req, res) => {
        const ticketId = req.params.id;
        const userId = req.userId;
        const userRole = req.userRole;

        const history =
            await ticketService.getTicketHistory({
                ticketId,
                userId,
                userRole
            });

        res.status(200).json({
            success: true,
            history
        });
    }
);
