import pool from "../config/db.js";
import redisClient from "../config/redis.js";

import * as assignmentRepo from "../repositories/assignment.repository.js";
import * as auditRepo from "../repositories/audit.repository.js";
import * as categoryRepo from "../repositories/category.repository.js";
import * as userRepo from "../repositories/user.repository.js";

import * as ticketRepo from "../repositories/ticket.repository.js";

import allowedTransitions from "../constants/allowedTransitions.js";
import { allowedSortFields, allowedOrders } from "../constants/allowedQueryParamValues.js";

import AppError from "../utils/AppError.js";

export const createTicketWorkflow = async (
    ticketData
) => {

    let client;

    try {

        client = await pool.connect();

        await client.query("BEGIN");

        const {
            title,
            description,
            priority,
            categoryId,
            createdBy
        } = ticketData;

        const category =
            await categoryRepo.findCategoryById(
                client,
                categoryId
            );

        if (!category) {
            throw new AppError(
                404,
                "Invalid category"
            );
        }

        const departmentId =
            category.department_id;

        const staffWorkload =
            await userRepo.findStaffByDepartmentWithWorkload(
                client,
                departmentId
            );

        let assignedTo = null;

        if (staffWorkload.length > 0) {
            assignedTo =
                staffWorkload[0].id;
        }

        const status =
            assignedTo
                ? "ASSIGNED"
                : "UNASSIGNED";

        const finalPriority =
            priority || "MEDIUM";

        const ticketObj = {
            title,
            description,
            priority: finalPriority,
            assignedTo,
            categoryId,
            departmentId,
            status,
            createdBy
        };

        const createdTicket =
            await ticketRepo.createTicket(
                client,
                ticketObj
            );

        await auditRepo.createAuditLog(client, {
            ticketId: createdTicket.id,
            action: "TICKET_CREATED",
            performedBy: createdBy,
            metadata: {
                status,
                priority: finalPriority
            }
        });

        if (assignedTo) {

            await assignmentRepo.createAssignment(client, {
                ticketId: createdTicket.id,
                assignedTo,
                assignedBy: createdBy
            });

            await auditRepo.createAuditLog(client, {
                ticketId: createdTicket.id,
                action: "TICKET_ASSIGNED",
                performedBy: createdBy,
                metadata: {
                    assignedTo
                }
            });
        }

        await client.query("COMMIT");

        await redisClient.del(
            "analytics:tickets",
            "analytics:departments",
            "analytics:staff-workload"
        );

    } catch (err) {

        if (client) {
            await client.query(
                "ROLLBACK"
            );
        }

        throw err;

    } finally {

        if (client) {
            client.release();
        }
    }
};

export const updateTicketStatus = async ({
    ticketId,
    status,
    userId,
    userRole
}) => {

    let client;

    try {

        client = await pool.connect();

        await client.query("BEGIN");

        const ticket =
            await ticketRepo.getTicketById(
                client,
                ticketId
            );

        if (!ticket) {
            throw new AppError(
                404,
                "Ticket not found"
            );
        }

        // STAFF can only update tickets assigned to them

        if (
            userRole === "staff" &&
            ticket.assigned_to !== userId
        ) {
            throw new AppError(
                403,
                "You can only update tickets assigned to you"
            );
        }

        const currentStatus =
            ticket.status;

        const allowedNextStatuses =
            allowedTransitions[
            currentStatus
            ] || [];

        if (
            !allowedNextStatuses.includes(
                status
            )
        ) {
            throw new AppError(
                400,
                `Invalid status transition from ${currentStatus} to ${status}`
            );
        }

        const updatedTicket =
            await ticketRepo.updateTicketStatus(
                client,
                ticketId,
                status
            );

        await auditRepo.createAuditLog(client, {
            ticketId,
            action: "STATUS_UPDATED",
            performedBy: userId,
            metadata: {
                from: currentStatus,
                to: status
            }
        });
        await client.query("COMMIT");

        await redisClient.del("ticketAnalytics");
        await redisClient.del("departmentAnalytics");
        await redisClient.del("staffWorkload");


        return updatedTicket;

    } catch (err) {

        if (client) {
            await client.query(
                "ROLLBACK"
            );
        }

        throw err;

    } finally {

        if (client) {
            client.release();
        }
    }
};

export const updateTicketAssignment = async ({
    ticketId,
    assignedTo,
    assignedBy
}) => {

    let client;

    try {

        client = await pool.connect();

        await client.query("BEGIN");

        const ticket =
            await ticketRepo.getTicketById(
                client,
                ticketId
            );

        if (!ticket) {
            throw new AppError(
                404,
                "Ticket not found"
            );
        }

        const userAssigned =
            await userRepo.getUserById(
                client,
                assignedTo
            );

        if (
            !userAssigned ||
            userAssigned.role !== "staff"
        ) {
            throw new AppError(
                400,
                "Invalid staff ID for assignment"
            );
        }

        const updatedTicket =
            await ticketRepo.updateTicketAssignment(
                client,
                ticketId,
                assignedTo
            );

        await assignmentRepo.createAssignment(client, {
            ticketId,
            assignedTo,
            assignedBy
        });

        const auditAction =
            ticket.assigned_to
                ? "TICKET_REASSIGNED"
                : "TICKET_ASSIGNED";

        await auditRepo.createAuditLog(client, {
            ticketId,
            action: auditAction,
            performedBy: assignedBy,
            metadata: {
                previousAssignedTo: ticket.assigned_to,
                assignedTo
            }
        });

        await client.query("COMMIT");

        await redisClient.del(
            "analytics:tickets",
            "analytics:departments",
            "analytics:staff-workload"
        );

        return updatedTicket;

    } catch (err) {

        if (client) {
            await client.query("ROLLBACK");
        }

        throw err;

    } finally {

        if (client) {
            client.release();
        }
    }
};

export const getTicketById = async (
    {
        ticketId,
        userId,
        userRole
    }
) => {

    let client;

    try {

        client = await pool.connect();

        const ticket =
            await ticketRepo.getTicketById(
                client,
                ticketId
            );

        if (!ticket) {
            throw new AppError(
                404,
                "Ticket not found"
            );
        }

        if (
            userRole === "staff" &&
            ticket.assigned_to !== userId
        ) {
            throw new AppError(
                403,
                "Forbidden: You can only view tickets assigned to you"
            );
        }

        if (
            userRole === "user" &&
            ticket.created_by !== userId
        ) {
            throw new AppError(
                403,
                "Forbidden: You can only view tickets you created"
            );
        }

        return ticket;

    } finally {

        if (client) {
            client.release();
        }
    }
};

export const getAssignedTickets = async ({
    staffId,
    page = 1,
    limit = 10,
    status,
    priority,
    sort,
    order,
    search
}) => {

    let client;

    try {

        client = await pool.connect();

        const offset =
            (page - 1) * limit;

        let sqlQuery = `
            SELECT *
            FROM tickets
            WHERE assigned_to = $1
        `;

        const values = [staffId];

        if (status) {

            sqlQuery += `
                AND status = $${values.length + 1}
            `;

            values.push(status);
        }

        if (priority) {

            sqlQuery += `
                AND priority = $${values.length + 1}
            `;

            values.push(priority);
        }

        if (search) {
            sqlQuery += `
                AND (title ILIKE $${values.length + 1} OR description ILIKE $${values.length + 1})
            `;
            values.push(`%${search}%`);
        }

        const sortField =
            allowedSortFields[sort]
            || "created_at";

        const sortOrder =
            allowedOrders[
            order?.toLowerCase()
            ] || "DESC";

        sqlQuery += `
            ORDER BY ${sortField} ${sortOrder}
            LIMIT $${values.length + 1}
            OFFSET $${values.length + 2}
        `;

        values.push(limit);
        values.push(offset);

        const tickets =
            await ticketRepo.getAssignedTicketsByStaffId({
                client,
                sqlQuery,
                values
            });

        return {
            page,
            limit,
            count: tickets.length,
            tickets
        };

    } finally {

        if (client) {
            client.release();
        }
    }
};

export const getMyTickets = async ({
    userId,
    page = 1,
    limit = 10,
    status,
    priority,
    sort,
    order,
    search
}) => {

    let client;

    try {

        client = await pool.connect();

        const offset =
            (page - 1) * limit;

        let sqlQuery = `
            SELECT *
            FROM tickets
            WHERE created_by = $1
        `;

        const values = [userId];

        if (status) {

            sqlQuery += `
                AND status = $${values.length + 1}
            `;

            values.push(status);
        }

        if (priority) {

            sqlQuery += `
                AND priority = $${values.length + 1}
            `;

            values.push(priority);
        }

        if (search) {
            sqlQuery += `
                AND (title ILIKE $${values.length + 1} OR description ILIKE $${values.length + 1})
            `;
            values.push(`%${search}%`);
        }

        const sortField =
            allowedSortFields[sort]
            || "created_at";

        const sortOrder =
            allowedOrders[
            order?.toLowerCase()
            ] || "DESC";

        sqlQuery += `
            ORDER BY ${sortField} ${sortOrder}
            LIMIT $${values.length + 1}
            OFFSET $${values.length + 2}
        `;

        values.push(limit);
        values.push(offset);

        const tickets =
            await ticketRepo.getTicketsByUserId({
                client,
                sqlQuery,
                values
            });

        return {
            page,
            limit,
            count: tickets.length,
            tickets
        };

    } finally {

        if (client) {
            client.release();
        }
    }
};

export const getTicketHistory = async ({
    ticketId,
    userId,
    userRole
}) => {
    let client;
    try {
        client = await pool.connect();
        const ticket = await ticketRepo.getTicketById(client, ticketId);
        if (!ticket)
            throw new AppError(404, 'Ticket not found');

        const { created_by, assigned_to } = ticket;

        if (userRole === 'staff' && userId !== assigned_to)
            throw new AppError(403, 'Forbidden: You can view history of tickets assigned to you');
        if (userRole === 'user' && userId !== created_by)
            throw new AppError(403, 'Forbidden: You can view history of tickets you created');

        const history = await auditRepo.getAuditLogsByTicketId(client, ticketId);

        return history;

    } catch (err) {
        throw err;
    } finally {
        if (client) {
            client.release();
        }
    }
}



