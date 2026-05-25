export const findStaffByDepartmentWithWorkload = async (client, departmentId) => {
    const result = await client.query(
        `
        SELECT
            u.id,
            u.name,
            u.email,
            u.created_at,
            COUNT(t.id)::INT AS workload
        FROM users u
        LEFT JOIN tickets t
            ON t.assigned_to = u.id
            AND t.status IN ('ASSIGNED', 'IN_PROGRESS')
        LEFT JOIN roles r
            ON u.role_id = r.id
        WHERE
            r.name = 'staff'
            AND u.department_id = $1
        GROUP BY
            u.id,
            u.name,
            u.email,
            u.created_at
        ORDER BY workload ASC;
        `,
        [departmentId]
    );

    return result.rows;
};

export const getUserById = async (client, userId) => {
    const result = await client.query(
        `
            SELECT
                u.id,
                u.name,
                u.email,
                r.name AS role,
                u.role_id,
                u.department_id,
                u.created_at
            FROM users u
            JOIN roles r
                ON u.role_id = r.id
            WHERE u.id = $1;
        `,
        [userId]
    );

    return result.rows[0];
};

