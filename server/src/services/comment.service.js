import pool from "../config/db.js";
import * as ticketRepo from "../repositories/ticket.repository.js";
import * as commentRepo from "../repositories/comment.repository.js";
import * as auditRepo from "../repositories/audit.repository.js";

export const createComment = async ({
    ticketId,
    content,
    createdBy,
    userRole
}) => {
    let client;

    try {
        client = await pool.connect();
        await client.query('BEGIN');
        const ticket = await ticketRepo.getTicketById(client, ticketId);
        if (!ticket)
            throw new AppError(404, 'Ticket not found');

        const { created_by, assigned_to } = ticket;

        if (userRole === 'staff' && createdBy !== assigned_to)
            throw new AppError(403, 'Forbidden: You can only comment on tickets assigned to you');
        if (userRole === 'user' && createdBy !== created_by)
            throw new AppError(403, 'Forbidden: You can only comment on tickets you created');

        const result = await commentRepo.createComment({ client, ticketId, content, createdBy });

        await auditRepo.createAuditLog(client, {
            ticketId,
            action: "COMMENT_ADDED",
            performedBy: createdBy,
            metadata: {
                commentLength: content.length,
                commentPreview: content.substring(0, 20) + (content.length > 20 ? "..." : "")
            }
        });

        await client.query("COMMIT");

        return result;
    }
    catch (err) {
        await client.query('ROLLBACK');
        throw err;
    }
    finally {
        if (client) {
            client.release();
        }
    }
}

export const getCommentsByTicketId = async ({ ticketId, userId, userRole }) => {
    let client;
    try {
        client = await pool.connect();
        const ticket = await ticketRepo.getTicketById(client, ticketId);
        if (!ticket)
            throw new AppError(404, 'Ticket not found');

        const { created_by, assigned_to } = ticket;

        if (userRole === 'staff' && createdBy !== assigned_to)
            throw new AppError(403, 'Forbidden: You can only get comments of tickets assigned to you');
        if (userRole === 'user' && createdBy !== created_by)
            throw new AppError(403, 'Forbidden: You can only get comments of tickets you created');

        const result = await commentRepo.getCommentsByTicketId(client, ticketId);

        return result;
    } catch (err) {
        throw err;
    } finally {
        if (client) {
            client.release();
        }
    }
}