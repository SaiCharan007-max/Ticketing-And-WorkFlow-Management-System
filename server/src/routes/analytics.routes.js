import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorization.middleware.js";
import {
    getTicketAnalytics,
    getDepartmentAnalytics
} from "../controllers/analytics.controller.js";

const router = express.Router();
router.get("/tickets", authMiddleware, authorizeRoles('admin'), getTicketAnalytics);
router.get("/departments", authMiddleware, authorizeRoles('admin'), getDepartmentAnalytics);
router.get("/staff-workload", authMiddleware, authorizeRoles('admin'), getstaffWorkload); 
export default router;