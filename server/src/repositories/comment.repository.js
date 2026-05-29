export const createComment = async ({
    client,
    ticketId,
    content,
    createdBy
}) => {

    const result = await client.query(
        `
        INSERT INTO comments (
            content,
            ticket_id,
            created_by
        )
        VALUES ($1, $2, $3)
        RETURNING
            id,
            content,
            ticket_id,
            created_by,
            created_at;
        `,
        [
            content,
            ticketId,
            createdBy
        ]
    );

    return result.rows[0];
};

export const getCommentsByTicketId = async (
    client,
    ticketId
) => {

    const result = await client.query(
        `
        SELECT
            c.id,
            c.content,
            c.ticket_id,
            c.created_by,
            u.name AS created_by_name,
            c.created_at
        FROM comments c
        JOIN users u
            ON c.created_by = u.id
        WHERE c.ticket_id = $1
        ORDER BY c.created_at ASC;
        `,
        [ticketId]
    );

    return result.rows;
};