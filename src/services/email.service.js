const config = require('../config/env');
const nodemailer = require('nodemailer');



const transporter = nodemailer.createTransport({
    host: config.emailHost,
    port: config.emailPort,
    secure: false,
    auth: {
        user: config.emailUser,
        pass: config.emailPass
    }
});

const sendEmail = async(options)=> {

    await transporter.sendMail({
        from: config.emailFrom,
        to: options.email,
        subject: options.subject,
        html: options.html
    })

}


module.exports = sendEmail;