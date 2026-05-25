export const createAssignment = async (client, assignmentInfo) => {
    const {ticketId, assignedTo, assignedBy} = assignmentInfo;
    const result = await client.query(
        `
            INSERT INTO ticket_assignments
                (ticket_id, assigned_to, assigned_by, assigned_at)
            VALUES ($1, $2, $3, NOW())
            RETURNING *;
        `,
        [ticketId, assignedTo, assignedBy]
    );
    return result.rows[0];
}