export const createComment = async ({client, ticketId, content, createdBy }) => {
    const result = await client.query(
        `
            INSERT INTO comments
                (content, ticket_id, created_by)
            VALUES
                ($1, $2, $3)
            RETURNING *;
        `, [content, ticketId, createdBy]
    );

    return result.rows[0];
}