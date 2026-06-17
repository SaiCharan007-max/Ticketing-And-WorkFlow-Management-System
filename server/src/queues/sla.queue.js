import { Queue } from "bullmq";

const slaQueue = new Queue(
    "sla-escalation",
    {
        connection: {
            url: process.env.REDIS_URL
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