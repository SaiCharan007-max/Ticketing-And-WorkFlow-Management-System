import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorization.middleware.js";
import { processSlaBreaches } from "../controllers/sla.controller.js";

const router = express.Router();
router.post("/process", authMiddleware, authorizeRoles("admin"), processSlaBreaches);
export default router;
