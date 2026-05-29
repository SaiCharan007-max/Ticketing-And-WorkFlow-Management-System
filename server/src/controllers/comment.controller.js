import asyncHandler from "../utils/asyncHandler.js";
import * as commentService from "../services/comment.service.js";

export const createComment = asyncHandler(async (
    req,
    res
) => {
    const ticketId = req.params.id;

    const { content } = req.body;   
    const createdBy = req.userId;
    const userRole = req.userRole;

    const createdComment = await commentService.createComment({     
        ticketId,
        content,
        createdBy,
        userRole
    });

    res.status(201).json({
        success: true,
        comment: createdComment
    });
});

export const getCommentsByTicketId = asyncHandler(async (
    req,
    res
) => {
    const ticketId = req.params.id;
    const userId = req.userId;
    const userRole = req.userRole;

    const ticketComments = await commentService.getCommentsByTicketId({ticketId, userId, userRole});

    res.status(200).json({
        success: true,
        comments: ticketComments
    });
});
