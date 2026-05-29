export const getTicketAnalytics = async (client) => {
    const result = await client.query(
        `
            SELECT
            COUNT(*) AS total_tickets,

            COUNT(*) FILTER (
                WHERE status = 'UNASSIGNED'
            ) AS open_tickets,

            COUNT(*) FILTER (
                WHERE status = 'ASSIGNED'
            ) AS assigned_tickets,

            COUNT(*) FILTER (
                WHERE status = 'IN_PROGRESS'
            ) AS in_progress_tickets,

            COUNT(*) FILTER (
                WHERE status = 'RESOLVED'
            ) AS resolved_tickets,

            COUNT(*) FILTER (
                WHERE status = 'CLOSED'
            ) AS closed_tickets

            FROM tickets;
        `
    );

    return result.rows[0];
};

export const getDepartmentAnalytics = async (client) => {
    const result = await client.query(
        `
            SELECT d.name AS department, COUNT(*)::INT AS ticket_count
            FROM tickets t 
            JOIN departments d ON t.department_id = d.id
            GROUP BY d.name
            ORDER BY ticket_count DESC;
        `
    );

    return result.rows;
};

export const getStaffWorkload = async (client) => {
    const result = await client.query(
        `
            SELECT
                u.id AS staff_id,
                u.name AS staff_name,
                COUNT(t.id)::INT AS active_tickets,
                d.name AS department
            FROM users u
            LEFT JOIN tickets t
                ON t.assigned_to = u.id
                AND t.status IN ('ASSIGNED', 'IN_PROGRESS')
            LEFT JOIN departments d
                ON u.department_id = d.id
            JOIN roles r
                ON u.role_id = r.id
            WHERE r.name = 'staff'
            GROUP BY u.id, u.name, d.name
            ORDER BY active_tickets DESC;
        `
    );

    return result.rows;
};
