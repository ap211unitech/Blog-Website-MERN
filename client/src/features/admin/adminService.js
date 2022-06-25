import axios from "axios";
import { BACKEND_HOST_URL } from "../../config/defaults";

// Get All Users List
const getAllUsers = async (authToken) => {
    const config = {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    }
    const res = await axios.get(`${BACKEND_HOST_URL}/admin/getAllUsers`, config);
    return res.data;
}

// Toggle User Role
const toggleRole = async (authToken, data) => {
    const config = {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    }
    const res = await axios.post(`${BACKEND_HOST_URL}/admin/toggleRole`, data, config);
    return res.data;
}

// Toggle User Block
const toggleBlock = async (authToken, data) => {
    const config = {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    }
    const res = await axios.post(`${BACKEND_HOST_URL}/admin/toggleBlock`, data, config);
    return res.data;
}

// Get user complete  details by user id 
const getUserDetails = async (authToken, data) => {
    const config = {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    }
    const res = await axios.post(`${BACKEND_HOST_URL}/admin/getUserDetailsByUserId`, data, config);
    return res.data;
}

export default {
    getAllUsers,
    toggleRole,
    toggleBlock,
    getUserDetails
}