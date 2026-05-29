export const createCategory = async (
    client,
    name,
    departmentId
) => {

    const result = await client.query(
        `
        INSERT INTO ticket_categories (
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

export const getAllCategories = async (
    client
) => {

    const result = await client.query(
        `
        SELECT
            tc.id,
            tc.name,
            tc.department_id,
            d.name AS department_name,
            tc.created_at,
            tc.updated_at
        FROM ticket_categories tc
        JOIN departments d
            ON tc.department_id = d.id
        ORDER BY tc.created_at DESC;
        `
    );

    return result.rows;
};

export const getCategoryByName = async (
    client,
    name
) => {

    const result = await client.query(
        `
        SELECT
            id,
            name,
            department_id,
            created_at,
            updated_at
        FROM ticket_categories
        WHERE name = $1;
        `,
        [name]
    );

    return result.rows[0];
};

export const getCategoryById = async (
    client,
    categoryId
) => {

    const result = await client.query(
        `
        SELECT
            id,
            name,
            department_id,
            created_at,
            updated_at
        FROM ticket_categories
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
        DELETE FROM ticket_categories
        WHERE id = $1
        RETURNING *;
        `,
        [categoryId]
    );

    return result.rows[0];
};

export const findCategoryById = getCategoryById;
