import axios from "axios";
import { BACKEND_HOST_URL } from "../../config/defaults";

const URL = BACKEND_HOST_URL;

// Get Latest Blogs
const getLatestBlogs = async () => {
    const res = await axios.get(`${URL}/blog/latest`);
    return res.data;
}

// Get Blog by blogID
const getBlogByBlogID = async (blogId) => {
    const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
    const res = await axios.get(`${URL}/blog/single/${blogId}`, { token });
    return res.data;
}

export default {
    getLatestBlogs,
    getBlogByBlogID
}