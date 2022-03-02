const path = require("path");

// Environmental Variables
require("dotenv").config({ path: path.resolve(__dirname, '../.env') });

const API_KEY = process.env.SENDGRID_KEY
const SENDER_EMAIL = process.env.SENDER_EMAIL

const sgMail = require("@sendgrid/mail");
const { activation } = require("./mailTemplates");

sgMail.setApiKey(API_KEY);

const activationLink = async ({ to, token }) => {
    const message = {
        to: [to],
        from: {
            name: 'Activation Link',
            email: SENDER_EMAIL
        },
        subject: 'Test mail',
        html: activation(token)
    }
    try {
        await sgMail.send(message);
        console.log('Email Sent...')
    } catch (err) {
        console.log(err)
    }
}
activationLink({ to: 'bjp4168@gmail.com', token: 'abc' })
module.exports = {
    activationLink
}