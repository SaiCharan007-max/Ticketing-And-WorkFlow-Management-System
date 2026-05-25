import express from "express";
import {
    createCategory,
    getAllCategories,
    deleteCategory
} from "../controllers/category.controller.js";

const router = express.Router();
router.post("/", authMiddleware, authorizeRoles('admin'), createCategory);
router.get("/", authMiddleware, authorizeRoles('admin'), getAllCategories);
router.delete("/:id", authMiddleware, authorizeRoles('admin'), deleteCategory);   
export default router;
