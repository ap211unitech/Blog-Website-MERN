import axios from 'axios';
import { BACKEND_HOST_URL } from '../../config/defaults'

const URL = BACKEND_HOST_URL;

// Register User With Form Data
const registerUserForm = async (user) => {
    const res = await axios.post(`${URL}/auth/register`, user);
    if (res.data) {
        localStorage.setItem('user', JSON.stringify(res.data))
    }
    return res.data;
}

// Register User With Form Data
const loginUserForm = async (user) => {
    const res = await axios.post(`${URL}/auth/login`, user);
    if (res.data) {
        localStorage.setItem('user', JSON.stringify(res.data))
    }
    return res.data;
}

// Logout User
const logout = async () => {
    localStorage.removeItem('user');
}

// Forgot Password ( Sends Email )
const forgotPassword = async (email) => {
    const res = await axios.post(`${URL}/auth/forgotpassword`, { email });
    return res.data;
}

// Reset Password
const resetPassword = async ({ newPassword, token }) => {
    const res = await axios.post(`${URL}/auth/resetpassword/${token}`, { newPassword });
    return res.data;
}

// Activate Account
const activateAccount = async ({ token, authToken }) => {
    const config = {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    }
    const res = await axios.get(`${URL}/auth/activate/${token}`, config);
    return res.data;
}

// Send Activation Mail Again
const sendActivationMail = async ({ authToken }) => {
    const config = {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    }
    const res = await axios.get(`${URL}/auth/send-activation-link`, config);
    return res.data;
}

// Google SignIn Authentication
const googleSignInAuthentication = async ({ idToken }) => {
    const res = await axios.post(`${URL}/auth/googlesignin`, { idToken });
    if (res.data) {
        localStorage.setItem('user', JSON.stringify(res.data))
    }
    return res.data;
}

// Change Password
const changePassword = async (data, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const res = await axios.post(`${URL}/auth/change-password`, data, config);
    return res.data;
}

export default {
    registerUserForm,
    loginUserForm,
    logout,
    forgotPassword,
    resetPassword,
    activateAccount,
    sendActivationMail,
    googleSignInAuthentication,
    changePassword
}