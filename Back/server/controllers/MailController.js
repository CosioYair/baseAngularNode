const nodeMailer = require('nodemailer');
const dotenv = require('dotenv').config();
const transporter = nodeMailer.createTransport({
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    secure: true,
    auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.APP_EMAIL_PASSWORD
    }
});

const MailController = {
    sendMail(to, subject, body) {
        let mailOptions = {
            from: `${process.env.APP_EMAIL_FROM} <${process.env.APP_EMAIL}>`,
            to: to,
            subject: subject,
            text: body,
        };
        return transporter.sendMail(mailOptions, (error, info) => {
            if (error)
                console.log(error);
        });
    },

    postMail(req, res) {
        const email = req.body.Email;
        const subject = req.body.Subject;
        const body = req.body.Body;
        MailController.sendMail(email, subject, body);
        res.status(200);
    },

};

module.exports = MailController;