import express from "express";
import {
    createComment,
    getCommentsByTicketId
} from "../controllers/comment.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorization.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/tickets/{id}/comments:
 *   post:
 *     summary: Add a comment to a ticket
 *     tags:
 *       - Comments
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
 *             $ref: '#/components/schemas/CreateCommentRequest'
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 comment:
 *                   $ref: '#/components/schemas/Comment'
 *       401:
 *         description: Missing or invalid JWT
 *       403:
 *         description: Access to the target ticket is not allowed for the current user role
 *       404:
 *         description: Ticket not found
 */
router.post("/:id/comments", authMiddleware, authorizeRoles('user', 'staff', 'admin'), createComment);

/**
 * @swagger
 * /api/tickets/{id}/comments:
 *   get:
 *     summary: List comments for a ticket
 *     tags:
 *       - Comments
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
 *         description: Comments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 comments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CommentWithAuthor'
 *       401:
 *         description: Missing or invalid JWT
 *       403:
 *         description: Access to the target ticket is not allowed for the current user role
 *       404:
 *         description: Ticket not found
 */
router.get("/:id/comments", authMiddleware, authorizeRoles('user', 'staff', 'admin'), getCommentsByTicketId);

export default router;
