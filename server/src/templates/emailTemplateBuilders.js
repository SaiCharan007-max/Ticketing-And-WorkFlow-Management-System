import EMAIL_TEMPLATES from "../constants/emailTemplates.js";

export const buildTicketCreatedEmail = ({
    recipient,
    ticket
}) => ({
    subject: `Ticket #${ticket.id} Created`,
    html: `
        <h2>Ticket Created</h2>

        <p>Hello ${recipient.name},</p>

        <p>Your ticket has been created successfully.</p>

        <ul>
            <li>ID: ${ticket.id}</li>
            <li>Title: ${ticket.title}</li>
            <li>Priority: ${ticket.priority}</li>
            <li>Status: ${ticket.status}</li>
        </ul>
    `
});

export const buildTicketAssignedEmail = ({
    recipient,
    ticket
}) => ({
    subject: `Ticket #${ticket.id} Assigned`,
    html: `
        <h2>New Ticket Assigned</h2>

        <p>Hello ${recipient.name},</p>

        <p>A ticket has been assigned to you.</p>

        <ul>
            <li>ID: ${ticket.id}</li>
            <li>Title: ${ticket.title}</li>
            <li>Priority: ${ticket.priority}</li>
        </ul>
    `
});

export const buildTicketReassignedEmail = ({
    recipient,
    ticket
}) => ({
    subject: `Ticket #${ticket.id} Reassigned`,
    html: `
        <h2>Ticket Reassigned</h2>

        <p>Hello ${recipient.name},</p>

        <p>This ticket has been reassigned to you.</p>

        <ul>
            <li>ID: ${ticket.id}</li>
            <li>Title: ${ticket.title}</li>
            <li>Priority: ${ticket.priority}</li>
        </ul>
    `
});

export const buildTicketResolvedEmail = ({
    recipient,
    ticket
}) => ({
    subject: `Ticket #${ticket.id} Resolved`,
    html: `
        <h2>Ticket Resolved</h2>

        <p>Hello ${recipient.name},</p>

        <p>Your ticket has been resolved.</p>

        <ul>
            <li>ID: ${ticket.id}</li>
            <li>Title: ${ticket.title}</li>
        </ul>
    `
});

export const buildTicketClosedEmail = ({
    recipient,
    ticket
}) => ({
    subject: `Ticket #${ticket.id} Closed`,
    html: `
        <h2>Ticket Closed</h2>

        <p>Hello ${recipient.name},</p>

        <p>Your ticket has been closed.</p>

        <ul>
            <li>ID: ${ticket.id}</li>
            <li>Title: ${ticket.title}</li>
        </ul>
    `
});

export const buildSlaEscalatedEmail = ({
    recipient,
    ticket
}) => ({
    subject: `SLA Escalation - Ticket #${ticket.id}`,
    html: `
        <h2>SLA Escalated</h2>

        <p>Hello ${recipient.name},</p>

        <p>This ticket exceeded its SLA threshold.</p>

        <ul>
            <li>ID: ${ticket.id}</li>
            <li>Title: ${ticket.title}</li>
            <li>Current Priority: ${ticket.priority}</li>
        </ul>

        <p>Please review immediately.</p>
    `
});

export const buildCriticalSlaBreachEmail = ({
    recipient,
    ticket
}) => ({
    subject: `CRITICAL SLA BREACH - Ticket #${ticket.id}`,
    html: `
        <h2>Critical SLA Breach</h2>

        <p>Hello ${recipient.name},</p>

        <p>This ticket has exceeded the highest SLA level.</p>

        <ul>
            <li>ID: ${ticket.id}</li>
            <li>Title: ${ticket.title}</li>
            <li>Priority: ${ticket.priority}</li>
        </ul>

        <p>Immediate action is required.</p>
    `
});

export const buildEmailTemplate = ({
    template,
    recipient,
    ticket
}) => {

    switch (template) {

        case EMAIL_TEMPLATES.TICKET_CREATED:
            return buildTicketCreatedEmail({
                recipient,
                ticket
            });

        case EMAIL_TEMPLATES.TICKET_ASSIGNED:
            return buildTicketAssignedEmail({
                recipient,
                ticket
            });

        case EMAIL_TEMPLATES.TICKET_REASSIGNED:
            return buildTicketReassignedEmail({
                recipient,
                ticket
            });

        case EMAIL_TEMPLATES.TICKET_RESOLVED:
            return buildTicketResolvedEmail({
                recipient,
                ticket
            });

        case EMAIL_TEMPLATES.TICKET_CLOSED:
            return buildTicketClosedEmail({
                recipient,
                ticket
            });

        case EMAIL_TEMPLATES.SLA_ESCALATED:
            return buildSlaEscalatedEmail({
                recipient,
                ticket
            });

        case EMAIL_TEMPLATES.CRITICAL_SLA_BREACH:
            return buildCriticalSlaBreachEmail({
                recipient,
                ticket
            });

        default:
            throw new Error(
                `Unknown email template: ${template}`
            );
    }
};