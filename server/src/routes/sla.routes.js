import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorization.middleware.js";
import { processAllSlaBreaches } from "../controllers/sla.controller.js";

const router = express.Router();
router.post("/process", authMiddleware, authorizeRoles("admin"), processAllSlaBreaches);
export default router;
