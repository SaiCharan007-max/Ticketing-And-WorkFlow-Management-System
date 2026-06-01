import asyncHandler from "../utils/asyncHandler.js";
import * as slaService from "../services/sla.service.js";

export const processAllSlaBreaches = asyncHandler(
    async (req, res) => {

        const result =
            await slaService
                .processAllSlaBreaches();

        res.status(200).json({
            success: true,
            ...result
        });
    }
);