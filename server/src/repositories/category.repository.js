export const createCategory = async (
    client,
    name,
    departmentId
) => {

    const result = await client.query(
        `
        INSERT INTO categories (
            name,
            department_id
        )
        VALUES ($1, $2)
        RETURNING *;
        `,
        [name, departmentId]
    );

    return result.rows[0];
};

export const getAllCategories = async (client) => {

    const result = await client.query(
        `
        SELECT
            c.id,
            c.name,
            c.department_id,
            d.name AS department_name,
            c.created_at
        FROM categories c
        JOIN departments d
            ON c.department_id = d.id
        ORDER BY c.created_at DESC;
        `
    );

    return result.rows;
};

export const getCategoryByNameAndDepartment = async (
    client,
    name,
    departmentId
) => {

    const result = await client.query(
        `
        SELECT *
        FROM categories
        WHERE name = $1
        AND department_id = $2;
        `,
        [name, departmentId]
    );

    return result.rows[0];
};

export const getCategoryById = async (
    client,
    categoryId
) => {

    const result = await client.query(
        `
        SELECT *
        FROM categories
        WHERE id = $1;
        `,
        [categoryId]
    );

    return result.rows[0];
};

export const deleteCategory = async (
    client,
    categoryId
) => {

    const result = await client.query(
        `
        DELETE FROM categories
        WHERE id = $1
        RETURNING *;
        `,
        [categoryId]
    );

    return result.rows[0];
};

