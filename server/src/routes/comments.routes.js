import express from "express";
import {
    createComment,
    getCommentsByTicketId
} from "../controllers/comment.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorization.middleware.js";

const router = express.Router();

router.post("/:id/comments", authMiddleware, authorizeRoles('user', 'staff', 'admin'), createComment);
router.get("/:id/comments", authMiddleware, authorizeRoles('user', 'staff', 'admin'), getCommentsByTicketId);

export default router;
