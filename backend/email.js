const nodemailer = require("nodemailer");

const email = process.env.TPC_EMAIL;
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: email, pass: process.env.TPC_EMAIL_PW }
});

async function sendEmail(data) {
    return new Promise(resolve => {
        if (!data.subject) {
            resovle({ statusCode: 400, data: "missing subject" });
            return;
        }
        if (!data.message) {
            resovle({ statusCode: 400, data: "missing message" });
            return;
        }

        let text = "";
        if (data.email) text += "From: " + data.email + "\n\n";
        text += data.message;

        transporter
            .sendMail({
                from: email,
                to: email,
                subject: data.subject,
                text: text
            })
            .then(() => {
                resolve({ statusCode: 200, data: "success" });
                return;
            })
            .catch(err => {
                console.log(err);
                resolve({ statusCode: 500, data: "failed to send email" });
                return;
            });
    });
}

module.exports.sendEmail = sendEmail;
