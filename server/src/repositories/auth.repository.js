import pool from "../config/db.js";

export const findUserByEmail = async (email) => {
    const result = await pool.query(
        `
            SELECT * FROM users
            WHERE email = $1;
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
            INSERT INTO users
                (email, password_hash, role)
            VALUES
                ($1, $2, 'USER')
            RETURNING id, email, role, created_at;
        `,
        [email, hashedPassword]
    );

    return result.rows[0];
};