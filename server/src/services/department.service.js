import pool from "../config/db.js";

import * as departmentRepo from "../repositories/department.repository.js";

import AppError from "../utils/AppError.js";

export const createDepartment = async (name) => {

    let client;

    try {

        client = await pool.connect();

        const existingDepartment =
            await departmentRepo.getDepartmentByName(
                client,
                name
            );

        if (existingDepartment) {
            throw new AppError(
                409,
                "Department already exists"
            );
        }

        return await departmentRepo.createDepartment(
            client,
            name
        );

    } finally {

        if (client) {
            client.release();
        }
    }
};

export const getAllDepartments = async () => {

    let client;

    try {

        client = await pool.connect();

        return await departmentRepo.getAllDepartments(client);

    } finally {

        if (client) {
            client.release();
        }
    }
};

export const deleteDepartment = async (departmentId) => {

    let client;

    try {

        client = await pool.connect();

        const department =
            await departmentRepo.getDepartmentById(
                client,
                departmentId
            );

        if (!department) {
            throw new AppError(404, "Department not found");
        }

        const staffCount =
            await departmentRepo.countDepartmentStaff(
                client,
                departmentId
            );

        if (Number(staffCount.count) > 0) {
            throw new AppError(
                400,
                "Department has staff assigned"
            );
        }

        const categoryCount =
            await departmentRepo.countDepartmentCategories(
                client,
                departmentId
            );

        if (Number(categoryCount.count) > 0) {
            throw new AppError(
                400,
                "Department has categories assigned"
            );
        }

        return await departmentRepo.deleteDepartment(
            client,
            departmentId
        );

    } finally {

        if (client) {
            client.release();
        }
    }
};
