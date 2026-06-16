import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorization.middleware.js";
import {
    createDepartment,
    getAllDepartments,
    deleteDepartment
} from "../controllers/department.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/departments:
 *   post:
 *     summary: Create a department
 *     tags:
 *       - Departments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDepartmentRequest'
 *     responses:
 *       201:
 *         description: Department created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 department:
 *                   $ref: '#/components/schemas/Department'
 *       401:
 *         description: Missing or invalid JWT
 *       403:
 *         description: Admin access required
 *       409:
 *         description: Department already exists
 */
router.post("/", authMiddleware, authorizeRoles('admin'), createDepartment);

/**
 * @swagger
 * /api/departments:
 *   get:
 *     summary: List all departments
 *     tags:
 *       - Departments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Departments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 departments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Department'
 *       401:
 *         description: Missing or invalid JWT
 *       403:
 *         description: Admin access required
 */
router.get("/", authMiddleware, authorizeRoles('admin'), getAllDepartments);

/**
 * @swagger
 * /api/departments/{id}:
 *   delete:
 *     summary: Delete a department
 *     tags:
 *       - Departments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Department identifier
 *     responses:
 *       200:
 *         description: Department deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 department:
 *                   $ref: '#/components/schemas/Department'
 *       401:
 *         description: Missing or invalid JWT
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Department not found
 *       400:
 *         description: Department still has staff or categories assigned
 */
router.delete("/:id", authMiddleware, authorizeRoles('admin'), deleteDepartment);   
export default router;
