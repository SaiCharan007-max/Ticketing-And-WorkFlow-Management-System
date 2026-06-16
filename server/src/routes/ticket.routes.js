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

/**
 * @swagger
 * /api/tickets:
 *   post:
 *     summary: Create a ticket
 *     tags:
 *       - Tickets
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTicketRequest'
 *     responses:
 *       201:
 *         description: Ticket created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 ticket:
 *                   $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Ticket payload validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Missing or invalid JWT
 *       403:
 *         description: The authenticated role is not allowed to create tickets
 *       404:
 *         description: Category not found
 */
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

/**
 * @swagger
 * /api/tickets/my:
 *   get:
 *     summary: List tickets created by the authenticated user
 *     tags:
 *       - Tickets
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number, defaults to 1.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *         description: Page size, capped at 50.
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [UNASSIGNED, ASSIGNED, IN_PROGRESS, RESOLVED, CLOSED]
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH, URGENT]
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [created_at, priority, status]
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Case-insensitive search across title and description.
 *     responses:
 *       200:
 *         description: User tickets retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 count:
 *                   type: integer
 *                 tickets:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Ticket'
 *       401:
 *         description: Missing or invalid JWT
 *       403:
 *         description: Only end users can access this endpoint
 */
router.get(
    "/my",
    authMiddleware,
    authorizeRoles("user"),
    getMyTickets
);

/**
 * @swagger
 * /api/tickets/assigned:
 *   get:
 *     summary: List tickets assigned to the authenticated staff user
 *     tags:
 *       - Tickets
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number, defaults to 1.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *         description: Page size, capped at 50.
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [UNASSIGNED, ASSIGNED, IN_PROGRESS, RESOLVED, CLOSED]
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH, URGENT]
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [created_at, priority, status]
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Case-insensitive search across title and description.
 *     responses:
 *       200:
 *         description: Assigned tickets retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 count:
 *                   type: integer
 *                 tickets:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Ticket'
 *       401:
 *         description: Missing or invalid JWT
 *       403:
 *         description: Only staff users can access this endpoint
 */
router.get(
    "/assigned",
    authMiddleware,
    authorizeRoles("staff"),
    getAssignedTickets
);

/**
 * @swagger
 * /api/tickets/{id}:
 *   get:
 *     summary: Get a ticket by id
 *     tags:
 *       - Tickets
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ticket identifier
 *     responses:
 *       200:
 *         description: Ticket retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 ticket:
 *                   $ref: '#/components/schemas/Ticket'
 *       401:
 *         description: Missing or invalid JWT
 *       403:
 *         description: The authenticated user is not allowed to view this ticket
 *       404:
 *         description: Ticket not found
 */
router.get(
    "/:id",
    authMiddleware,
    authorizeRoles("user", "staff", "admin"),
    getTicketById
);

/**
 * @swagger
 * /api/tickets/{id}/status:
 *   patch:
 *     summary: Update a ticket's status
 *     tags:
 *       - Tickets
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ticket identifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTicketStatusRequest'
 *     responses:
 *       200:
 *         description: Ticket status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 ticket:
 *                   $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Invalid status transition
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Missing or invalid JWT
 *       403:
 *         description: Staff users can only update tickets assigned to them
 *       404:
 *         description: Ticket not found
 */
router.patch(
    "/:id/status",
    authMiddleware,
    authorizeRoles("staff", "admin"),
    updateTicketStatus
);

/**
 * @swagger
 * /api/tickets/{id}/assign:
 *   patch:
 *     summary: Assign or reassign a ticket to a staff user
 *     tags:
 *       - Tickets
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ticket identifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignTicketRequest'
 *     responses:
 *       200:
 *         description: Ticket assignment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 ticket:
 *                   $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Invalid staff identifier for assignment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Missing or invalid JWT
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Ticket not found
 */
router.patch(
    "/:id/assign",
    authMiddleware,
    authorizeRoles("admin"),
    assignTicket
);

/**
 * @swagger
 * /api/tickets/{id}/history:
 *   get:
 *     summary: Get audit history for a ticket
 *     tags:
 *       - Audit Logs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ticket identifier
 *     responses:
 *       200:
 *         description: Ticket audit history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 history:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AuditLog'
 *       401:
 *         description: Missing or invalid JWT
 *       403:
 *         description: The authenticated user is not allowed to view this ticket history
 *       404:
 *         description: Ticket not found
 */
router.get("/:id/history", authMiddleware, authorizeRoles("user", "staff", "admin"), getTicketHistory);

export default router;
