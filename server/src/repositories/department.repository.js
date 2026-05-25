export const createDepartment = async (
    client,
    name
) => {

    const result = await client.query(
        `
        INSERT INTO departments (name)
        VALUES ($1)
        RETURNING *;
        `,
        [name]
    );

    return result.rows[0];
};

export const getAllDepartments = async (client) => {

    const result = await client.query(
        `
        SELECT *
        FROM departments
        ORDER BY created_at DESC;
        `
    );

    return result.rows;
};

export const getDepartmentByName = async (
    client,
    name
) => {

    const result = await client.query(
        `
        SELECT *
        FROM departments
        WHERE name = $1;
        `,
        [name]
    );

    return result.rows[0];
};

export const getDepartmentById = async (
    client,
    departmentId
) => {

    const result = await client.query(
        `
        SELECT *
        FROM departments
        WHERE id = $1;
        `,
        [departmentId]
    );

    return result.rows[0];
};

export const deleteDepartment = async (
    client,
    departmentId
) => {

    const result = await client.query(
        `
        DELETE FROM departments
        WHERE id = $1
        RETURNING *;
        `,
        [departmentId]
    );

    return result.rows[0];
};

export const countDepartmentStaff = async (
    client,
    departmentId
) => {

    const result = await client.query(
        `
        SELECT COUNT(*)
        FROM users
        WHERE department_id = $1;
        `,
        [departmentId]
    );

    return result.rows[0];
};

export const countDepartmentCategories = async (
    client,
    departmentId
) => {

    const result = await client.query(
        `
        SELECT COUNT(*)
        FROM categories
        WHERE department_id = $1;
        `,
        [departmentId]
    );

    return result.rows[0];
};
