// src/workers/sla.worker.js

import { Worker } from "bullmq";

import { processSingleTicketEscalation }
    from "../services/sla.service.js";

const worker = new Worker(
    "sla-escalation",

    async (job) => {

        console.log("\n=================================");
        console.log("SLA JOB RECEIVED");
        console.log("Job ID:", job.id);
        console.log("Job Name:", job.name);
        console.log("Ticket ID:", job.data.ticketId);
        console.log("Started At:", new Date());
        console.log("=================================\n");

        const result =
            await processSingleTicketEscalation(
                job.data.ticketId
            );

        console.log(
            `SLA processing finished for Ticket ${job.data.ticketId}`
        );

        return result;
    },

    {
        connection: {
            url: process.env.REDIS_URL
        }
    }
);

worker.on(
    "ready",

    () => {
        console.log(
            "SLA Worker is ready and listening for jobs"
        );
    }
);

worker.on(
    "active",

    (job) => {
        console.log(
            `Job ${job.id} is now ACTIVE`
        );
    }
);

worker.on(
    "completed",

    (job, result) => {

        console.log("\n=================================");
        console.log("JOB COMPLETED");
        console.log("Job ID:", job.id);
        console.log("Job Name:", job.name);
        console.log("Ticket ID:", job.data.ticketId);
        console.log("Result:", result);
        console.log("Completed At:", new Date());
        console.log("=================================\n");
    }
);

worker.on(
    "failed",

    (job, err) => {

        console.error("\n=================================");
        console.error("JOB FAILED");
        console.error("Job ID:", job?.id);
        console.error("Job Name:", job?.name);
        console.error("Ticket ID:", job?.data?.ticketId);
        console.error("Error:", err.message);
        console.error("Stack:", err.stack);
        console.error("=================================\n");
    }
);

worker.on(
    "error",

    (err) => {
        console.error(
            "BullMQ Worker Error:",
            err
        );
    }
);

export default worker;