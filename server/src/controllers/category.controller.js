import asyncHandler from "../utils/asyncHandler.js";
import * as categoryService from "../services/category.service.js";

export const createCategory = asyncHandler(async (req, res) => {
    const { name, departmentId } = req.body;

    const category = await categoryService.createCategory({
        name,
        departmentId
    });

    res.status(201).json({
        success: true,
        category
    });
});

export const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await categoryService.getAllCategories();

    res.status(200).json({
        success: true,
        categories
    });
});

export const deleteCategory = asyncHandler(async (req, res) => {
    const categoryId = req.params.id;

    const deletedCategory = await categoryService.deleteCategory(categoryId);

    res.status(200).json({
        success: true,
        category: deletedCategory
    });
});
