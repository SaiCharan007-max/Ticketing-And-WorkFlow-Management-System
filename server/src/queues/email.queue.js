import {Queue} from "bullmq";

const emailQueue = new Queue("sendEmail", {
    connection: {
        host: process.env.REDIS_HOST || "localhost",
        port: Number(process.env.REDIS_PORT) || 6379
    }
});

export const addEmailJob = async ({ticketId, recipientId, template}) => {
    return await emailQueue.add(
        `sendEmail:${ticketId}`,
        { ticketId, recipientId, template },
        { delay: Number(process.env.EMAIL_DELAY) || 5000 }
    );
}

export default emailQueue;