export const createTicket = async (client, ticketData) => {
    const {
        title,
        description,
        status,
        priority,
        categoryId,
        departmentId,
        assignedTo,
        createdBy
    } = ticketData;

    const result = await client.query(
        `
        INSERT INTO tickets (
            title,
            description,
            status,
            priority,
            category_id,
            department_id,
            assigned_to,
            created_by
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
        `,
        [
            title,
            description,
            status,
            priority,
            categoryId,
            departmentId,
            assignedTo,
            createdBy
        ]
    );

    return result.rows[0];
};

export const updateTicketAssignment = async (client, ticketId, assignedTo) => {
    const result = await client.query(
        `
        UPDATE tickets
        SET
            assigned_to = $1,
            updated_at = NOW()
        WHERE id = $2
        RETURNING *;
        `,
        [assignedTo, ticketId]
    );

    return result.rows[0];
};

export const updateTicketStatus = async (client, ticketId, status) => {
    const result = await client.query(
        `
        UPDATE tickets
        SET
            status = $1,
            updated_at = NOW()
        WHERE id = $2
        RETURNING *;
        `,
        [status, ticketId]
    );

    return result.rows[0];
};

export const getTicketById = async (client, ticketId) => {
    const result = await client.query(
        `
        SELECT *
        FROM tickets
        WHERE id = $1;
        `,
        [ticketId]
    );

    return result.rows[0];
};

export const updateTicketStatusRepo = async (client, ticketId, status) => {
    const result = await client.query(
        `
            UPDATE tickets
            SET status=$1
            WHERE id=$2
            RETURNING *;
        `, [status, ticketId]
    );

    return result.rows[0];
}

export const getAssignedTicketsByStaffId = async (client, staffId) => {
    const result = await client.query(
        `
        SELECT *
        FROM tickets
        WHERE assigned_to = $1;
        `,
        [staffId]
    );
    return result.rows;
};

export const getTicketsByUserId = async (client, userId) => {
    const result = await client.query(
        `
        SELECT *
        FROM tickets
        WHERE created_by=$1;
        `,
        [userId]
    );
    return result.rows;
};