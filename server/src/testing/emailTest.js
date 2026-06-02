import {addEmailJob} from "../queues/email.queue.js";

// check if email worker is processing jobs correctly and sending the email using the transporter configuration

const testEmailJob = async () => {
    try {
        const job = await addEmailJob({
            ticketId: "12345",
            recipientId: "user1",
            templateId: "template1"
        });
        console.log("Email job added:", job.id);
    } catch (error) {
        console.error("Error adding email job:", error);
    }   
};

testEmailJob();