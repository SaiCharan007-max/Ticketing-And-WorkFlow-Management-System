import pool from "../config/db.js";
import * as ticketRepo from "../repositories/ticket.repository.js";
import AppError from "../utils/AppError.js";
import SLA_HOURS from "../constants/slaHours.js";
import * as auditRepo from "../repositories/audit.repository.js";
import ESCALATION_MAP from "../constants/escalationMap.js";
import * as slaRepo from "../repositories/sla.repository.js";
import { addSlaJob } from "../queues/sla.queue.js";
import { addEmailJob } from "../queues/email.queue.js";
import EMAIL_TEMPLATES from "../constants/emailTemplates.js";

export const processAllSlaBreaches = async () => {
    let client;

    try {

        client = await pool.connect();
        let processed = 0;
        await client.query("BEGIN");
        const breaches = await slaRepo.getSLABreaches(client);

        for (const ticket of breaches) {
            const currentPriority = ticket.priority;
            const nextPriority = ESCALATION_MAP[currentPriority];
            if (!nextPriority) {
                await auditRepo.createAuditLog(client, {
                    ticketId: ticket.id,
                    action: "CRITICAL_SLA_BREACH",
                    performedBy: null,
                    metadata: {
                        status: ticket.status,
                        priority: currentPriority,
                        slaDeadline: ticket.sla_deadline
                    }
                });
                continue;
            }
            const newSLADeadlineHours = SLA_HOURS[nextPriority];
            if (!newSLADeadlineHours) {
                throw new AppError(500, "SLA escalation hours missing for priority: " + nextPriority);
            }
            const newSLADeadline = new Date(ticket.sla_deadline);
            newSLADeadline.setHours(
                newSLADeadline.getHours() + newSLADeadlineHours
            );
            await ticketRepo.updateTicketPriority({
                client,
                ticketId: ticket.id,
                priority: nextPriority,
                slaDeadline: newSLADeadline
            });

            await auditRepo.createAuditLog(client, {
                ticketId: ticket.id,
                action: "SLA_ESCALATED",
                performedBy: null,
                metadata: {
                    oldPriority: currentPriority,
                    newPriority: nextPriority,
                    previousDeadline: ticket.sla_deadline,
                    newDeadline: newSLADeadline
                }
            });
            processed++;
        }

        await client.query("COMMIT");

        return { processed };

    } catch (err) {
        if (client) {
            await client.query("ROLLBACK");
        }
        throw err;

    }
    finally {
        if (client) {
            client.release();
        }
    }
};


export const processSingleTicketEscalation = async (ticketId) => {
    let client;
    try {
        client = await pool.connect();
        await client.query("BEGIN");

        console.log("=================================");
        console.log("Processing SLA escalation for ticket ID:", ticketId);
        console.log("=================================");

        const ticket = await ticketRepo.getTicketById(
            client,
            ticketId
        );

        if (!ticket) {
            console.log(
                `Ticket ${ticketId} not found`
            );

            throw new AppError(
                404,
                "Ticket not found with ID: " + ticketId
            );
        }

        console.log(
            `Ticket Found | Status: ${ticket.status} | Priority: ${ticket.priority}`
        );

        if (
            ticket.status === "RESOLVED" ||
            ticket.status === "CLOSED"
        ) {

            console.log(
                `Skipping ticket ${ticketId} because status is ${ticket.status}`
            );

            await client.query("COMMIT");

            if (ticket.assigned_to) {
                await addEmailJob({
                    ticketId: ticket.id,
                    recipientId: ticket.assigned_to,
                    template: EMAIL_TEMPLATES.SLA_ESCALATED
                });
            }

            return {
                skipped: true
            };
        }

        if (
            new Date() <
            new Date(ticket.sla_deadline)
        ) {

            console.log(
                `Skipping ticket ${ticketId} because SLA deadline has not been reached yet`
            );

            console.log(
                `Current Time: ${new Date()}`
            );

            console.log(
                `SLA Deadline: ${ticket.sla_deadline}`
            );

            await client.query("COMMIT");

            return {
                skipped: true
            };
        }

        const currentPriority =
            ticket.priority;

        const nextPriority =
            ESCALATION_MAP[
            currentPriority
            ];

        console.log(
            `Current Priority: ${currentPriority}`
        );

        console.log(
            `Next Priority: ${nextPriority}`
        );

        if (!nextPriority) {

            console.log(
                `Ticket ${ticketId} already at highest priority`
            );

            await auditRepo.createAuditLog(client, {
                ticketId: ticket.id,
                action: "CRITICAL_SLA_BREACH",
                performedBy: null,
                metadata: {
                    status: ticket.status,
                    priority: currentPriority,
                    slaDeadline: ticket.sla_deadline
                }
            });

            console.log(
                `CRITICAL_SLA_BREACH audit log created for ticket ${ticketId}`
            );

            await client.query("COMMIT");

            return;
        }

        const newSLADeadlineHours =
            SLA_HOURS[nextPriority];

        console.log(
            `New SLA Hours: ${newSLADeadlineHours}`
        );

        const newSLADeadline =
            new Date(ticket.sla_deadline);

        newSLADeadline.setHours(
            newSLADeadline.getHours() +
            newSLADeadlineHours
        );

        console.log(
            `Previous Deadline: ${ticket.sla_deadline}`
        );

        console.log(
            `New Deadline: ${newSLADeadline}`
        );

        await ticketRepo.updateTicketPriority({
            client,
            ticketId: ticket.id,
            priority: nextPriority,
            slaDeadline: newSLADeadline
        });

        console.log(
            `Ticket ${ticketId} escalated from ${currentPriority} -> ${nextPriority}`
        );

        await addSlaJob({
            ticketId: ticket.id,
            delay:
                newSLADeadlineHours *
                60 *
                60 *
                1000
        });

        console.log(
            `New SLA job scheduled for ticket ${ticketId}`
        );

        console.log(
            `Delay: ${newSLADeadlineHours} hours`
        );

        await auditRepo.createAuditLog(client, {
            ticketId: ticket.id,
            action: "SLA_ESCALATED",
            performedBy: null,
            metadata: {
                oldPriority: currentPriority,
                newPriority: nextPriority,
                previousDeadline: ticket.sla_deadline,
                newDeadline: newSLADeadline
            }
        });

        console.log(
            `SLA_ESCALATED audit log created for ticket ${ticketId}`
        );

        await client.query("COMMIT");

        console.log(
            `Transaction committed successfully for ticket ${ticketId}`
        );

        console.log(
            "================================="
        );

        if (ticket.assigned_to) {
            await addEmailJob({
                ticketId: ticket.id,
                recipientId: ticket.assigned_to,
                template: EMAIL_TEMPLATES.SLA_ESCALATED
            });
        }

        return {
            escalated: true
        };
    } catch (err) {
        if (client) {
            await client.query("ROLLBACK");
        }
        throw err;
    } finally {
        if (client)
            client.release();
    }
}