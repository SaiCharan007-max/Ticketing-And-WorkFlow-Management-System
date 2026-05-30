import pool from "../config/db.js";
import * as ticketRepo from "../repositories/ticket.repository.js";
import AppError from "../utils/AppError.js";
import SLA_HOURS from "../constants/slaHours.js";
import * as auditRepo from "../repositories/audit.repository.js";
import ESCALATION_MAP from "../constants/escalationMap.js";
import * as slaRepo from "../repositories/sla.repository.js";


export const processSlaBreaches = async () => {
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