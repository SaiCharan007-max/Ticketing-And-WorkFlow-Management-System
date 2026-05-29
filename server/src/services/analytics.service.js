import pool from "../config/db.js";
import * as analyticsRepo from "../repositories/analytics.repository.js";

export const getTicketAnalytics = async () => {
    let client;

    try {
        client = await pool.connect();
        return await analyticsRepo.getTicketAnalytics(client);
    } finally {
        if (client) {
            client.release();
        }
    }
};

export const getDepartmentAnalytics = async () => {
    let client;

    try {
        client = await pool.connect();
        return await analyticsRepo.getDepartmentAnalytics(client);
    } finally {
        if (client) {
            client.release();
        }
    }
};

export const getstaffWorkload = async () => {
    let client;

    try {
        client = await pool.connect();
        return await analyticsRepo.getStaffWorkload(client);
    } finally {
        if (client) {
            client.release();
        }
    }
};
