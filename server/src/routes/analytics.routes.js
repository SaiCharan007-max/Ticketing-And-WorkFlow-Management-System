import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorization.middleware.js";
import {
    getTicketAnalytics,
    getDepartmentAnalytics,
    getstaffWorkload
} from "../controllers/analytics.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/analytics/tickets:
 *   get:
 *     summary: Get aggregate ticket counts by status
 *     tags:
 *       - Tickets
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ticket analytics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 analytics:
 *                   $ref: '#/components/schemas/TicketAnalytics'
 *       401:
 *         description: Missing or invalid JWT
 *       403:
 *         description: Admin access required
 */
router.get("/tickets", authMiddleware, authorizeRoles('admin'), getTicketAnalytics);

/**
 * @swagger
 * /api/analytics/departments:
 *   get:
 *     summary: Get ticket totals grouped by department
 *     tags:
 *       - Departments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Department analytics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 analytics:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DepartmentAnalyticsItem'
 *       401:
 *         description: Missing or invalid JWT
 *       403:
 *         description: Admin access required
 */
router.get("/departments", authMiddleware, authorizeRoles('admin'), getDepartmentAnalytics);

/**
 * @swagger
 * /api/analytics/staff-workload:
 *   get:
 *     summary: Get active ticket workload for staff users
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Staff workload analytics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 analytics:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/StaffWorkloadItem'
 *       401:
 *         description: Missing or invalid JWT
 *       403:
 *         description: Admin access required
 */
router.get("/staff-workload", authMiddleware, authorizeRoles('admin'), getstaffWorkload); 
export default router;
