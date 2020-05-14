const nodemailer = require("nodemailer");

const email = process.env.TPC_EMAIL;
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: email, pass: process.env.TPC_EMAIL_PW }
});

async function sendEmail(subject, text) {
    if (!subject) return;
    if (!text) return;

    try {
        transporter.sendMail({
            from: email,
            to: email,
            subject: subject,
            text: text
        });
    } catch (err) {
        console.log(err);
    }
}

module.exports.sendEmail = sendEmail;
