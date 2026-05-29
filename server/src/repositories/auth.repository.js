import pool from "../config/db.js";

export const findUserByEmail = async (email) => {
    const result = await pool.query(
        `
            SELECT
                u.*,
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

export const createUser = async ({
    email,
    hashedPassword
}) => {

    const result = await pool.query(
        `
            WITH inserted_user AS (
                INSERT INTO users
                    (
                        name,
                        email,
                        password_hash,
                        role_id
                    )
                VALUES
                    (
                        split_part($1, '@', 1),
                        $1,
                        $2,
                        (
                            SELECT id
                            FROM roles
                            WHERE name = 'user'
                        )
                    )
                RETURNING
                    id,
                    email,
                    created_at
            )
            SELECT
                id,
                email,
                'user' AS role,
                created_at
            FROM inserted_user;
        `,
        [email, hashedPassword]
    );

    return result.rows[0];
};
