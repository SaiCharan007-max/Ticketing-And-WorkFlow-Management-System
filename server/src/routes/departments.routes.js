import express from "express";
import authMiddleware from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/authorization.middleware";
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
