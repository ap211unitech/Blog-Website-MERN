const path = require("path");

// Environmental Variables
require("dotenv").config({ path: path.resolve(__dirname, '../.env') });

const URL = process.env.BACKEND_HOST_URL
const API_KEY = process.env.SENDGRID_KEY
const SENDER_EMAIL = process.env.SENDER_EMAIL

const sgMail = require("@sendgrid/mail");
const { activationTemplate } = require("./mailTemplates");

sgMail.setApiKey(API_KEY);

const activationEmail = async ({ to, token }) => {
    const message = {
        to: [to],
        from: {
            name: 'Activation Link',
            email: SENDER_EMAIL
        },
        subject: 'Test mail',
        html: activationTemplate(URL, token)
    }
    try {
        await sgMail.send(message);
        console.log('Email Sent...')
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    activationEmail
}