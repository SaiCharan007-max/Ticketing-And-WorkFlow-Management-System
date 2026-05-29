import pool from "../config/db.js";
import * as analyticsRepo from "../repositories/analytics.repository.js";
import redisClient from "../config/redis.js";

export const getTicketAnalytics = async () => {
    let client;

    try {

        const cached =
            await redisClient.get(
                "analytics:tickets"
            );

        if (cached) {

            console.log(
                "CACHE HIT: analytics:tickets"
            );

            return JSON.parse(cached);
        }

        console.log(
            "CACHE MISS: analytics:tickets"
        );

        client = await pool.connect();

        const result =
            await analyticsRepo.getTicketAnalytics(
                client
            );

        await redisClient.set(
            "analytics:tickets",
            JSON.stringify(result),
            {
                EX: 360
            }
        );

        return result;

    } finally {

        if (client) {
            client.release();
        }
    }
};

export const getDepartmentAnalytics = async () => {
    let client;

    try {
        const cached = await redisClient.get("analytics:departments");
        if (cached) {
            console.log(
                "CACHE HIT: analytics:departments"
            );
            return JSON.parse(cached);
        }
        console.log(
            "CACHE MISS: analytics:departments"
        );
        client = await pool.connect();
        const result = await analyticsRepo.getDepartmentAnalytics(client);
        await redisClient.set("analytics:departments", JSON.stringify(result), { EX: 360 });
        return result;
    } finally {
        if (client) {
            client.release();
        }
    }
};

export const getstaffWorkload = async () => {
    let client;

    try {
        const cached = await redisClient.get("analytics:staffWorkload");
        if (cached) {
            console.log(
                "CACHE HIT: analytics:staffWorkload"
            );
            return JSON.parse(cached);
        }
        console.log(
            "CACHE MISS: analytics:staffWorkload"
        );
        client = await pool.connect();

        const result = await analyticsRepo.getStaffWorkload(client);
        await redisClient.set("analytics:staffWorkload", JSON.stringify(result), { EX: 360 });
        return result;
    } finally {
        if (client) {
            client.release();
        }
    }
};
