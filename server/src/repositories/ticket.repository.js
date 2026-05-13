export const createTicket = async (client, ticketData) => {
    const result = await client.query(
        `
            INSERT INTO tickets (title, description, status, priority, category_id, department_id, assigned_to, created_by, ai_predicted_category_id, ai_confidence_score)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *;
        `, 
        [ticketData.title, ticketData.description, ticketData.status, ticketData.priority, ticketData.category_id, ticketData.department_id, ticketData.assigned_to, ticketData.created_by, NULL, NULL]
    );

    return result.rows[0];
};

export const updateTicketAssignment = async (client, ticketId, assigned_to) => {
    const result = await client.query(
        `
            UPDATE tickets 
            SET assigned_to=$1, updated_at=NOW()
            WHERE id=$2;
        `,
        [assigned_to, ticketId]
    );

    return result.rows[0];
}

export const updateTicketStatus = async (client, ticketId, status) => {
    const result = await client.query(
        `
            UPDATE tickets 
            SET status=$1, updated_at=NOW()
            WHERE id=$2;
        `,
        [status, ticketId]
    ); 
    return result.rows[0];
}


export const findTicketById = async (client, ticketId) => {
    const result = await client.query(
        `
            SELECT * FROM tickets WHERE id=$1;
        `,
        [ticketId]
    );
    return result.rows[0];
}