export const createStaff = async (
    client,
    {
        name,
        email,
        passwordHash,
        roleId,
        departmentId
    }
) => {

    const result = await client.query(
        `
        INSERT INTO users (
            name,
            email,
            password_hash,
            role_id,
            department_id
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING
            id,
            name,
            email,
            role_id,
            department_id,
            created_at;
        `,
        [
            name,
            email,
            passwordHash,
            roleId,
            departmentId
        ]
    );

    return result.rows[0];
};

export const getStaffByEmail = async (
    client,
    email
) => {

    const result = await client.query(
        `
        SELECT
            u.id,
            u.email,
            r.name AS role
        FROM users u
        JOIN roles r
            ON u.role_id = r.id
        WHERE u.email = $1;
        `,
        [email]
    );

    return result.rows[0];
};

export const getRoleByName = async (
    client,
    roleName
) => {

    const result = await client.query(
        `
        SELECT *
        FROM roles
        WHERE name = $1;
        `,
        [roleName]
    );

    return result.rows[0];
};

export const getAllStaff = async (
    client
) => {

    const result = await client.query(
        `
        SELECT
            u.id,
            u.name,
            u.email,
            d.name AS department,
            u.created_at
        FROM users u
        JOIN roles r
            ON u.role_id = r.id
        LEFT JOIN departments d
            ON u.department_id = d.id
        WHERE r.name = 'staff'
        ORDER BY u.created_at DESC;
        `
    );

    return result.rows;
};

export const getStaffById = async (
    client,
    staffId
) => {

    const result = await client.query(
        `
        SELECT
            u.id,
            u.name,
            u.email,
            r.name AS role,
            u.department_id
        FROM users u
        JOIN roles r
            ON u.role_id = r.id
        WHERE
            u.id = $1
            AND r.name = 'staff';
        `,
        [staffId]
    );

    return result.rows[0];
};

export const countActiveAssignedTickets = async (
    client,
    staffId
) => {

    const result = await client.query(
        `
        SELECT COUNT(*)::INT AS count
        FROM tickets
        WHERE
            assigned_to = $1
            AND status IN (
                'ASSIGNED',
                'IN_PROGRESS'
            );
        `,
        [staffId]
    );

    return result.rows[0].count;
};

export const deleteStaff = async (
    client,
    staffId
) => {

    const result = await client.query(
        `
        DELETE FROM users
        WHERE id = $1
        RETURNING id;
        `,
        [staffId]
    );

    return result.rows[0];
};
