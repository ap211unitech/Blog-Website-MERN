import axios from "axios";
import { BACKEND_HOST_URL } from "../../config/defaults";

const URL = BACKEND_HOST_URL;

// Get All Categories
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
const deleteCategory = async (data, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
        data
    }
    const res = await axios.delete(`${URL}/category/${data.categoryId}`, config);
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

// Edit category
const editCategory = async (data, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const res = await axios.patch(`${URL}/category/${data.categoryId}`, data, config);
    return res.data;
}

export default {
    getAllCategory,
    addCategory,
    deleteCategory,
    editCategory
}