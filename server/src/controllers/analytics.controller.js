import asyncHandler from "../utils/asyncHandler.js";
import * as analyticsService from "../services/analytics.service.js";

export const getTicketAnalytics = asyncHandler(async (req, res) => {
    const analyticsData = await analyticsService.getTicketAnalytics();

    res.status(200).json({
        success: true,
        analytics: analyticsData
    });
})

export const getDepartmentAnalytics = asyncHandler(async (req, res) => {
    const analyticsData = await analyticsService.getDepartmentAnalytics();

    res.status(200).json({
        success: true,
        analytics: analyticsData
    });
})

export const getstaffWorkload = asyncHandler(async (req, res) => {
    const analyticsData = await analyticsService.getstaffWorkload();

    res.status(200).json({
        success: true,
        analytics: analyticsData
    });
})