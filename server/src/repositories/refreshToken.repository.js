import pool from "../config/db.js";

export const createRefreshToken = async ({
    client,
    token,
    userId,
    expiresAt
}) => {

    const result =
        await client.query(
            `
            INSERT INTO refresh_tokens (
                token,
                user_id,
                expires_at
            )
            VALUES ($1,$2,$3)
            RETURNING *;
            `,
            [
                token,
                userId,
                expiresAt
            ]
        );

    return result.rows[0];
};

export const findRefreshToken = async ({
    client,
    token
}) => {

    const result =
        await client.query(
            `
            SELECT *
            FROM refresh_tokens
            WHERE token = $1;
            `,
            [token]
        );

    return result.rows[0];
};

export const deleteRefreshToken = async ({
    client,
    token
}) => {

    await client.query(
        `
        DELETE
        FROM refresh_tokens
        WHERE token = $1;
        `,
        [token]
    );
};