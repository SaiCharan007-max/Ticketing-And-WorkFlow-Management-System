import asyncHandler from "../utils/asyncHandler.js";
import * as staffService from "../services/staff.service.js";

export const createStaff = asyncHandler(async (req, res) => {

    const {
        name,
        email,
        password,
        departmentId
    } = req.body;

    const staff = await staffService.createStaff({
        name,
        email,
        password,
        departmentId
    });

    res.status(201).json({
        success: true,
        staff
    });
});

export const getAllStaff = asyncHandler(async (req, res) => {

    const staff = await staffService.getAllStaff();

    res.status(200).json({
        success: true,
        staff
    });
});

export const deleteStaff = asyncHandler(async (req, res) => {

    const staffId = req.params.id;

    const deletedStaff =
        await staffService.deleteStaff(staffId);

    res.status(200).json({
        success: true,
        staff: deletedStaff
    });
});
