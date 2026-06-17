import {Queue} from "bullmq";

const emailQueue = new Queue("sendEmail", {
    connection: {
        url: process.env.REDIS_URL
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