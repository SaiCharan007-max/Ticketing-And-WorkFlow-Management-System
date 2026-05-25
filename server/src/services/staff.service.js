import bcrypt from "bcrypt";

import pool from "../config/db.js";

import * as staffRepo from "../repositories/staff.repository.js";
import * as departmentRepo from "../repositories/department.repository.js";

import AppError from "../utils/AppError.js";

export const createStaff = async ({
    name,
    email,
    password,
    departmentId
}) => {

    let client;

    try {

        client = await pool.connect();

        await client.query("BEGIN");

        const department =
            await departmentRepo.getDepartmentById(
                client,
                departmentId
            );

        if (!department) {
            throw new AppError(404, "Department not found");
        }

        const existingStaff =
            await staffRepo.getStaffByEmail(
                client,
                email
            );

        if (existingStaff) {
            throw new AppError(409, "Email already exists");
        }

        const role =
            await staffRepo.getRoleByName(
                client,
                "staff"
            );

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const createdStaff =
            await staffRepo.createStaff(
                client,
                {
                    name,
                    email,
                    passwordHash: hashedPassword,
                    roleId: role.id,
                    departmentId
                }
            );

        await client.query("COMMIT");

        return createdStaff;

    } catch (err) {

        if (client) {
            await client.query("ROLLBACK");
        }

        throw err;

    } finally {

        if (client) {
            client.release();
        }
    }
};

export const getAllStaff = async () => {

    let client;

    try {

        client = await pool.connect();

        return await staffRepo.getAllStaff(client);

    } finally {

        if (client) {
            client.release();
        }
    }
};

export const deleteStaff = async (staffId) => {

    let client;

    try {

        client = await pool.connect();

        await client.query("BEGIN");

        const staff =
            await staffRepo.getStaffById(
                client,
                staffId
            );

        if (!staff) {
            throw new AppError(
                404,
                "Staff not found"
            );
        }

        const activeTickets =
            await staffRepo.countActiveAssignedTickets(
                client,
                staffId
            );

        if (activeTickets > 0) {
            throw new AppError(
                400,
                "Cannot delete staff with active assigned tickets"
            );
        }

        await staffRepo.deleteStaff(
            client,
            staffId
        );

        await client.query("COMMIT");

        return {
            success: true
        };

    } catch (err) {

        if (client) {
            await client.query("ROLLBACK");
        }

        throw err;

    } finally {

        if (client) {
            client.release();
        }
    }
};
