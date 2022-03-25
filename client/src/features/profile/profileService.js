import axios from "axios";
import { BACKEND_HOST_URL } from '../../config/defaults'

const URL = BACKEND_HOST_URL;

// Get my profile
const getMyProfile = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const res = await axios.get(`${URL}/profile/me`, config);
    return res.data;
}

// Edit my profile
const editMyProfile = async (token, data) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const res = await axios.post(`${URL}/profile/update-profile`, data, config);
    return res.data;
}

// Get any user profile
const getAnyUserProfile = async (profileId) => {
    const token = JSON.parse(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')).token : null;
    const res = await axios.post(`${URL}/profile/view/${profileId}`, { token });
    return res.data;
}

// Follow/Unfollow any user profile
const followAnyUserProfile = async (profileId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const res = await axios.get(`${URL}/profile/follow/${profileId}`, config);
    return res.data;
}

export default {
    getMyProfile,
    editMyProfile,
    getAnyUserProfile,
    followAnyUserProfile
}