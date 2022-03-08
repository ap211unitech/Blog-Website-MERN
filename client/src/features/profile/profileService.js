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

export default {
    getMyProfile
}