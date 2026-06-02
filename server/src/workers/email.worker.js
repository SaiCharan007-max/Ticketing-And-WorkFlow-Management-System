import { Worker } from 'bullmq';
import * as emailService from '../services/email.service.js';

const emailWorker = new Worker(
    "sendEmail",
    async (job) => {
        console.log("\n=================================");
        console.log("Email Job Received");
        console.log("Job ID:", job.id);
        const result = await emailService.sendEmail({
            ticketId: job.data.ticketId,
            recipientId: job.data.recipientId,
            template: job.data.template
        });
        return result;
    },
    {
        connection: {
            host: process.env.REDIS_HOST || "localhost",
            port: Number(process.env.REDIS_PORT) || 6379
        }
    }
);