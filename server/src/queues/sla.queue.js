import { Queue } from "bullmq";

const slaQueue = new Queue(
    "sla-escalation",
    {
        connection: {
            host: process.env.REDIS_HOST || "localhost",
            port: Number(process.env.REDIS_PORT) || 6379
        }
    }
);

export const addSlaJob = async ({
    ticketId,
    delay
}) => {
    return await slaQueue.add(
        `checkSla:${ticketId}`,
        { ticketId },
        { delay }
    );
};

export default slaQueue;