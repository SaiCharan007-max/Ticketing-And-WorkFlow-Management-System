import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorization.middleware.js";
import {
    createStaff,
    getAllStaff,
    deleteStaff
} from "../controllers/staff.controller.js";

const router = express.Router();

router.post("/", authMiddleware, authorizeRoles('admin'), createStaff);
router.get("/", authMiddleware, authorizeRoles('admin'), getAllStaff);
router.delete("/:id", authMiddleware, authorizeRoles('admin'), deleteStaff);

export default router;
