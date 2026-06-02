import nodemailer from "nodemailer";

const emailTransporter =
    nodemailer.createTransport({
        service: "gmail",

        auth: {
            user:
                process.env.SMTP_USER,

            pass:
                process.env.SMTP_PASS
        }
    });

export default emailTransporter;