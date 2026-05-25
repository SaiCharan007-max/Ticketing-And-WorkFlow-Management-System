import asyncHandler from "../utils/asyncHandler.js";
import * as departmentService from "../services/department.service.js";

export const createDepartment = asyncHandler(async (req, res) => {
    const { name } = req.body;

    const department =
        await departmentService.createDepartment(name);

    res.status(201).json({
        success: true,
        department
    });
});

export const getAllDepartments = asyncHandler(async (req, res) => {
    const departments =
        await departmentService.getAllDepartments();

    res.status(200).json({
        success: true,
        departments
    });
});

export const deleteDepartment = asyncHandler(async (req, res) => {
    const departmentId = req.params.id;

    const deletedDepartment =
        await departmentService.deleteDepartment(departmentId);

    res.status(200).json({
        success: true,
        department: deletedDepartment
    });
});
