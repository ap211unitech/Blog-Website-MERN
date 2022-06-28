const path = require("path");

// Environmental Variables
require("dotenv").config({ path: path.resolve(__dirname, '../.env') });

const URL = process.env.CLIENT_HOST_URL
const API_KEY = process.env.SENDGRID_KEY
const SENDER_EMAIL = process.env.SENDER_EMAIL

const sgMail = require("@sendgrid/mail");
const { activationTemplate, forgotPasswordTemplate, userRoleChangedEmailTemplate, userBlockEmailTemplate } = require("./mailTemplates");

sgMail.setApiKey(API_KEY);

// Sends Email For Activate Account
const activationEmail = async ({ to, token }) => {
    const message = {
        to: [to],
        from: {
            name: 'uBlogit',
            email: SENDER_EMAIL
        },
        subject: 'Activate your account',
        html: activationTemplate(URL, token)
    }
    try {
        await sgMail.send(message);
        console.log('Activation Link Email Sent...')
    } catch (err) {
        console.log(err)
    }
}

// Sends Email For Reset Password
const forgotPasswordEmail = async ({ to, token }) => {
    const message = {
        to: [to],
        from: {
            name: 'uBlogit',
            email: SENDER_EMAIL
        },
        subject: 'Reset your Password',
        html: forgotPasswordTemplate(URL, token)
    }
    try {
        await sgMail.send(message);
        console.log('Reset Password Email Sent...')
    } catch (err) {
        console.log(err)
    }
}

// Sends Email when user role changed
const userRoleChangedEmail = async ({ to, isAdminNow }) => {
    const message = {
        to: [to],
        from: {
            name: 'uBlogit',
            email: SENDER_EMAIL
        },
        subject: 'Your role have been changed',
        html: userRoleChangedEmailTemplate(URL, isAdminNow)
    }
    try {
        await sgMail.send(message);
        console.log('User role changed Email Sent...')
    } catch (err) {
        console.log(err)
    }
}

// Sends Email when user block/unblock
const userBlockEmail = async ({ to, isBlockNow }) => {
    const message = {
        to: [to],
        from: {
            name: 'uBlogit',
            email: SENDER_EMAIL
        },
        subject: 'Your status have been changed',
        html: userBlockEmailTemplate(URL, isBlockNow)
    }
    try {
        await sgMail.send(message);
        console.log('User status changed Email Sent...')
    } catch (err) {
        console.log(err)
    }
}
module.exports = {
    activationEmail,
    forgotPasswordEmail,
    userRoleChangedEmail,
    userBlockEmail
}