import express from "express";
import {
    assignTicket,
    createTicket,
    getAssignedTickets,
    getMyTickets,
    getTicketById,
    updateTicketStatus,
    getTicketHistory
} from "../controllers/ticket.controller.js";
import validateCreateTicket from "../middlewares/validateCreateTicket.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorization.middleware.js";

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    authorizeRoles(
        'user',
        'staff',
        'admin'
    ),
    validateCreateTicket,
    createTicket
);

router.get(
    "/my",
    authMiddleware,
    authorizeRoles("user"),
    getMyTickets
);

router.get(
    "/assigned",
    authMiddleware,
    authorizeRoles("staff"),
    getAssignedTickets
);

router.get(
    "/:id",
    authMiddleware,
    authorizeRoles("user", "staff", "admin"),
    getTicketById
);

router.patch(
    "/:id/status",
    authMiddleware,
    authorizeRoles("staff", "admin"),
    updateTicketStatus
);

router.patch(
    "/:id/assign",
    authMiddleware,
    authorizeRoles("admin"),
    assignTicket
);

router.get("/:id/history", authMiddleware, authorizeRoles("user", "staff", "admin"), getTicketHistory);

export default router;
