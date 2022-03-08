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


export default {
    registerUserForm,
    loginUserForm,
    logout
}