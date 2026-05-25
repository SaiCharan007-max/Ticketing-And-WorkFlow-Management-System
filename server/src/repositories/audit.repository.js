export const createAuditLog = async (client, logInfo) => {
    const {ticketId, action, performedBy, metadata} = logInfo;

    const result = await client.query(
        `
            INSERT INTO audit_logs
                (ticket_id, action, performed_by, metadata)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `,
        [ticketId, action, performedBy, metadata]
    );

    return result.rows[0];
}

export const getAuditLogsByTicketId = async (client, ticketId) => {
    const result = await client.query(
        `
            SELECT id, ticket_id, action, performed_by, metadata, created_at
            FROM audit_logs
            WHERE ticket_id = $1
            ORDER BY created_at ASC;
        `,
        [ticketId]
    );

    return result.rows;
}