import express from "express";
import {
    createCategory,
    getAllCategories,
    deleteCategory
} from "../controllers/category.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorization.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a ticket category
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategoryRequest'
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 category:
 *                   $ref: '#/components/schemas/Category'
 *       401:
 *         description: Missing or invalid JWT
 *       403:
 *         description: Admin access required
 *       409:
 *         description: Category already exists
 */
router.post("/", authMiddleware, authorizeRoles('admin'), createCategory);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: List all ticket categories
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 categories:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CategoryWithDepartment'
 *       401:
 *         description: Missing or invalid JWT
 *       403:
 *         description: Admin access required
 */
router.get("/", authMiddleware, authorizeRoles('admin'), getAllCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete a ticket category
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category identifier
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 category:
 *                   $ref: '#/components/schemas/Category'
 *       401:
 *         description: Missing or invalid JWT
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Category not found
 */
router.delete("/:id", authMiddleware, authorizeRoles('admin'), deleteCategory);   
export default router;
