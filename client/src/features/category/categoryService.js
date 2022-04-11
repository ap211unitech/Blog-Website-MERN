import axios from "axios";
import { BACKEND_HOST_URL } from "../../config/defaults";

const URL = BACKEND_HOST_URL;

// Get Latest Blogs
const getAllCategory = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const res = await axios.get(`${URL}/category`, config);
    return res.data;
}

////////////////////////////////// ADMIN ACTIONS //////////////////////////////////

// Delete a category
const deleteCategory = async (id, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const res = await axios.delete(`${URL}/category/${id}`, config);
    return res.data;
}

// Add a new category
const addCategory = async (data, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const res = await axios.post(`${URL}/category`, data, config);
    return res.data;
}

export default {
    getAllCategory,
    addCategory,
    deleteCategory
}