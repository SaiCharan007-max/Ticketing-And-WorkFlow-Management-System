import emailTransporter from "../config/emailTransporter.js";
import * as userRepo from "../repositories/user.repository.js";
import * as ticketRepo from "../repositories/ticket.repository.js";
import pool from "../config/db.js";
import { buildEmailTemplate } from "../templates/emailTemplateBuilders.js";
import AppError from "../utils/appError.js";

export const sendEmail = async ({
    ticketId,
    recipientId,
    template
}) => {
    let client;
    try {
        client = await pool.connect();
        const recipient = await userRepo.getUserById(client, recipientId);

        if (!recipient) {
            throw new AppError("Recipient not found");
        }

        const ticket = await ticketRepo.getTicketById(client, ticketId);

        if (!ticket) {
            throw new AppError("Ticket not found");
        }

        const { subject, html } = buildEmailTemplate({
            template,
            recipient,
            ticket
        });

        console.log(
            `[EMAIL] Sending ${template} email to ${recipient.email}`
        );

        const info =
            await emailTransporter.sendMail({

                from:
                    process.env.SMTP_USER,

                to:
                    recipient.email,

                subject:
                    subject,

                html:
                    html
            });

        console.log(
            `[EMAIL] Successfully sent ${template} email to ${recipient.email}`
        );

        return info;
    } catch (err) {
        throw err;
    }
    finally {
        if (client) {
            client.release();
        }
    }
};

