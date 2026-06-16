import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorization.middleware.js";
import {
    createStaff,
    getAllStaff,
    deleteStaff
} from "../controllers/staff.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/staff:
 *   post:
 *     summary: Create a staff user
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStaffRequest'
 *     responses:
 *       201:
 *         description: Staff user created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 staff:
 *                   $ref: '#/components/schemas/CreatedStaff'
 *       401:
 *         description: Missing or invalid JWT
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Department not found
 *       409:
 *         description: Email already exists
 */
router.post("/", authMiddleware, authorizeRoles('admin'), createStaff);

/**
 * @swagger
 * /api/staff:
 *   get:
 *     summary: List all staff users
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Staff users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 staff:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/StaffSummary'
 *       401:
 *         description: Missing or invalid JWT
 *       403:
 *         description: Admin access required
 */
router.get("/", authMiddleware, authorizeRoles('admin'), getAllStaff);

/**
 * @swagger
 * /api/staff/{id}:
 *   delete:
 *     summary: Delete a staff user
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Staff user identifier
 *     responses:
 *       200:
 *         description: Staff user deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 staff:
 *                   $ref: '#/components/schemas/StaffDeleteResult'
 *       401:
 *         description: Missing or invalid JWT
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Staff user not found
 *       400:
 *         description: Staff user still has active assigned tickets
 */
router.delete("/:id", authMiddleware, authorizeRoles('admin'), deleteStaff);

export default router;
