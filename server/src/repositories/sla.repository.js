export const getSLABreaches = async (client) => {
    const result = await client.query(
        `
            SELECT *
            FROM tickets
            WHERE
                status IN (
                    'UNASSIGNED',
                    'ASSIGNED',
                    'IN_PROGRESS'
                )
            AND sla_deadline < NOW();
        `
    );

    return result.rows;
}