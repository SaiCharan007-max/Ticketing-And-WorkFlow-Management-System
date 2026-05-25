export const getTicketAnalytics = async (client) => {
    const result = await client.query(
        `
            SELECT
    COUNT(*) AS total_tickets,

    COUNT(*) FILTER (
        WHERE status = 'OPEN'
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
    )
}

export const getDepartmentAnalytics = async (client) => {
    const result = await client.query(
        `
            SELECT d.dept_name as department, COUNT(*) as ticketCount
            FROM tickets t 
            JOIN departments d ON t.department_id = d.id
            GROUP BY d.dept_name
            ORDER BY ticketCount DESC;
        `
    )
    return result.rows;
}