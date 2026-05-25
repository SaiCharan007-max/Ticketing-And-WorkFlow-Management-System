import pool from "../config/db.js";

import * as assignmentRepo from "../repositories/assignment.repository.js";
import * as auditRepo from "../repositories/audit.repository.js";
import * as categoryRepo from "../repositories/category.repository.js";
import * as userRepo from "../repositories/user.repository.js";

import * as ticketRepo from "../repositories/ticket.repository.js";

import allowedTransitions from "../helpers/allowedTransitions.js";

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

        return createdTicket;

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

        await auditRepo.createAuditLog(client, {
            ticketId,
            action: "TICKET_REASSIGNED",
            performedBy: assignedBy,
            metadata: {
                assignedTo
            }
        });

        await client.query("COMMIT");

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
    ticketId
) => {

    let client;

    try {

        client = await pool.connect();

        const ticket =
            await ticketRepo.getTicketById(
                client,
                ticketId
            );

        return ticket;

    } finally {

        if (client) {
            client.release();
        }
    }
};

export const getAssignedTickets = async (
    staffId
) => {

    let client;

    try {

        client = await pool.connect();

        const tickets =
            await ticketRepo.getAssignedTicketsByStaffId(
                client,
                staffId
            );

        return tickets;

    } finally {

        if (client) {
            client.release();
        }
    }
};

export const getMyTickets = async (
    userId
) => {

    let client;

    try {

        client = await pool.connect();

        const tickets =
            await ticketRepo.getTicketsByUserId(
                client,
                userId
            );

        return tickets;

    } finally {

        if (client) {
            client.release();
        }
    }
};
