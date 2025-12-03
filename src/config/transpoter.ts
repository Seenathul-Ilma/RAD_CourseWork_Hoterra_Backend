import nodemailer from "nodemailer"
import dotenv from "dotenv";

dotenv.config(); // load .env

const SMTP_MAIL_USERNAME = process.env.SMTP_MAIL_USERNAME as string
const SMTP_MAIL_PASSWORD = process.env.SMTP_MAIL_PASSWORD as string

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,   // true for 465, false for other ports
    auth: {
        user: SMTP_MAIL_USERNAME,
        pass: SMTP_MAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false, // to handle self-signed certificates
    },
})

export default transporter