import axios from "axios";
import { BACKEND_HOST_URL } from "../../config/defaults";

const URL = BACKEND_HOST_URL;

// Get Latest Blogs
const getLatestBlogs = async () => {
    const res = await axios.get(`${URL}/blog/latest`);
    return res.data;
}

// Get blogs of a category by categoryId
const getBlogsByCategoryId = async ({ categoryId }) => {
    const res = await axios.get(`${URL}/blog/${categoryId}`);
    return res.data;
}

// Get blogs of user by userId
const getBlogsOfUser = async ({ userId }) => {
    const res = await axios.get(`${URL}/blog/user/${userId}`);
    return res.data;
}

// Get Blog by blogID
const getBlogByBlogID = async (blogId) => {
    const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
    const res = await axios.post(`${URL}/blog/single/${blogId}`, { token });
    return res.data;
}

// Like a blog
const likeBlogByBlogID = async (blogId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const res = await axios.post(`${URL}/blog/like/${blogId}`, {}, config);
    return res.data;
}

// DisLike a blog
const dislikeBlogByBlogID = async (blogId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const res = await axios.post(`${URL}/blog/dislike/${blogId}`, {}, config);
    return res.data;
}

// Comment on a blog
const commentBlogByBlogID = async (blogId, text, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const res = await axios.post(`${URL}/blog/comment/${blogId}`, { text }, config);
    return res.data;
}

// Delete comment on a blog
const deleteCommentBlogByBlogID = async (blogId, commentId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const res = await axios.delete(`${URL}/blog/comment/${blogId}/${commentId}`, config);
    return res.data;
}

// Write a new blog
const writeNewBlog = async (data, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const res = await axios.post(`${URL}/blog/write`, data, config);
    return res.data;
}

// Delete a Blog
const deleteBlog = async ({ id, prime }, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: { prime }
    }
    const res = await axios.delete(`${URL}/blog/delete/${id}`, config);
    return res.data;
}

// Edit a blog
const editBlog = async (data, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const res = await axios.post(`${URL}/blog/edit/${data.blogId}`, data, config);
    return res.data;
}

export default {
    getLatestBlogs,
    getBlogsByCategoryId,
    getBlogsOfUser,
    getBlogByBlogID,
    likeBlogByBlogID,
    dislikeBlogByBlogID,
    commentBlogByBlogID,
    deleteCommentBlogByBlogID,
    writeNewBlog,
    deleteBlog,
    editBlog
}