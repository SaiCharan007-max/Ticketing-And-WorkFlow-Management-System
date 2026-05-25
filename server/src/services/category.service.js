import pool from "../config/db.js";

import * as categoryRepo from "../repositories/category.repository.js";

import AppError from "../utils/AppError.js";

export const createCategory = async ({
    name,
    departmentId
}) => {

    let client;

    try {

        client = await pool.connect();

        const existingCategory =
            await categoryRepo.getCategoryByNameAndDepartment(
                client,
                name,
                departmentId
            );

        if (existingCategory) {
            throw new AppError(
                409,
                "Category already exists in this department"
            );
        }

        const createdCategory =
            await categoryRepo.createCategory(
                client,
                name,
                departmentId
            );

        return createdCategory;

    } finally {

        if (client) {
            client.release();
        }
    }
};

export const getAllCategories = async () => {

    let client;

    try {

        client = await pool.connect();

        return await categoryRepo.getAllCategories(client);

    } finally {

        if (client) {
            client.release();
        }
    }
};

export const deleteCategory = async (categoryId) => {

    let client;

    try {

        client = await pool.connect();

        const category =
            await categoryRepo.getCategoryById(
                client,
                categoryId
            );

        if (!category) {
            throw new AppError(404, "Category not found");
        }

        return await categoryRepo.deleteCategory(
            client,
            categoryId
        );

    } finally {

        if (client) {
            client.release();
        }
    }
};
