import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorization.middleware.js";
import { processAllSlaBreaches } from "../controllers/sla.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/sla/process:
 *   post:
 *     summary: Process all SLA breaches and escalate overdue tickets
 *     tags:
 *       - Tickets
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: SLA breach processing completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 processed:
 *                   type: integer
 *       401:
 *         description: Missing or invalid JWT
 *       403:
 *         description: Admin access required
 */
router.post("/process", authMiddleware, authorizeRoles("admin"), processAllSlaBreaches);
export default router;
