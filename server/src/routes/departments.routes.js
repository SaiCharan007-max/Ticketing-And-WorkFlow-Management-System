import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorization.middleware.js";
import {
    createDepartment,
    getAllDepartments,
    deleteDepartment
} from "../controllers/department.controller.js";

const router = express.Router();
router.post("/", authMiddleware, authorizeRoles('admin'), createDepartment);
router.get("/", authMiddleware, authorizeRoles('admin'), getAllDepartments);
router.delete("/:id", authMiddleware, authorizeRoles('admin'), deleteDepartment);   
export default router;
