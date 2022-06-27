import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { isValidJSON } from "../../app/helpers";
import blogService from "./blogService";

const initialState = {
    latestBlogs: null,
    singleBlog: null,
    blogsOfUser: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    successMessage: [],
    errorMessage: []
}


// Get Latest Blogs
export const getLatestBlogs = createAsyncThunk('/blog/latest', async (thunkAPI) => {
    try {
        return await blogService.getLatestBlogs();
    } catch (err) {
        const message = (err.response && err.response.data && err.response.data.message) || err.message || err.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

// Get Blogs of a categoryId
export const getBlogsByCategoryId = createAsyncThunk('/blog/selectedCategory', async (data, thunkAPI) => {
    try {
        return await blogService.getBlogsByCategoryId(data);
    } catch (err) {
        const message = (err.response && err.response.data && err.response.data.message) || err.message || err.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

// Get Blogs of a user by serrId
export const getBlogsOfUser = createAsyncThunk('/blog/specificUser', async (data, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth?.user?.token;
        return await blogService.getBlogsOfUser(data, token);
    } catch (err) {
        const message = (err.response && err.response.data && err.response.data.message) || err.message || err.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

// Get Blog by blogID
export const getBlogByBlogID = createAsyncThunk('/blog/single', async (blogId, thunkAPI) => {
    try {
        return await blogService.getBlogByBlogID(blogId);
    } catch (err) {
        const message = (err.response && err.response.data && err.response.data.message) || err.message || err.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

// Like a blog by it's blogId
export const likeBlogByBlogID = createAsyncThunk('/blog/like', async (blogId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth?.user?.token;
        return await blogService.likeBlogByBlogID(blogId, token);
    } catch (err) {
        const message = (err.response && err.response.data && err.response.data.message) || err.message || err.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

// Dis-Like a blog by it's blogId
export const dislikeBlogByBlogID = createAsyncThunk('/blog/dislike', async (blogId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth?.user?.token;
        return await blogService.dislikeBlogByBlogID(blogId, token);
    } catch (err) {
        const message = (err.response && err.response.data && err.response.data.message) || err.message || err.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

// Comment a blog by it's blogId
export const commentBlogByBlogID = createAsyncThunk('/blog/comment', async (data, thunkAPI) => {
    try {
        const { blogId, text } = data;
        const token = thunkAPI.getState().auth?.user?.token;
        return await blogService.commentBlogByBlogID(blogId, text, token);
    } catch (err) {
        const message = (err.response && err.response.data && err.response.data.message) || err.message || err.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

// Delete Comment on a blog by it's blogId and comment Id
export const deleteCommentBlogByBlogID = createAsyncThunk('/blog/comment/delete', async (data, thunkAPI) => {
    try {
        const { blogId, commentId } = data;
        const token = thunkAPI.getState().auth?.user?.token;
        return await blogService.deleteCommentBlogByBlogID(blogId, commentId, token);
    } catch (err) {
        const message = (err.response && err.response.data && err.response.data.message) || err.message || err.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

// Write a new blog
export const writeNewBlog = createAsyncThunk('/blog/write', async (data, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth?.user?.token;
        return await blogService.writeNewBlog(data, token);
    } catch (err) {
        const message = (err.response && err.response.data && err.response.data.message) || err.message || err.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

// Edit a blog
export const editBlogByBlogId = createAsyncThunk('/blog/edit', async (data, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth?.user?.token;
        return await blogService.editBlog(data, token);
    } catch (err) {
        const message = (err.response && err.response.data && err.response.data.message) || err.message || err.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

// Delete a blog
export const deleteBlog = createAsyncThunk('/blog/delete', async (data, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth?.user?.token;
        return await blogService.deleteBlog(data, token);
    } catch (err) {
        const message = (err.response && err.response.data && err.response.data.message) || err.message || err.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

const blogSlice = createSlice({
    name: 'blog',
    initialState,
    reducers: {
        blogReset: (state, action) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.successMessage = [];
            state.errorMessage = [];
        },
        blogResetLogout: (state, action) => {
            state.latestBlogs = null;
            state.blogsOfUser = null;
            state.singleBlog = null;
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.successMessage = [];
            state.errorMessage = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getLatestBlogs.pending, (state, action) => {
                state.latestBlogs = null;
                state.singleBlog = null;
                state.isLoading = true;
                state.isSuccess = false;
                state.isError = false;
                state.successMessage = [];
                state.errorMessage = [];
            })
            .addCase(getLatestBlogs.fulfilled, (state, action) => {
                state.latestBlogs = action.payload;
                state.singleBlog = null;
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = false;
                state.successMessage = [];
                state.errorMessage = [];
            })
            .addCase(getLatestBlogs.rejected, (state, action) => {
                state.latestBlogs = null;
                state.singleBlog = null;
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.successMessage = [];
                state.errorMessage = isValidJSON(action.payload) ? Object.values(JSON.parse(action.payload)) : [action.payload];;
            })
            .addCase(getBlogsByCategoryId.pending, (state, action) => {
                state.latestBlogs = null;
                state.singleBlog = null;
                state.isLoading = true;
                state.isSuccess = false;
                state.isError = false;
                state.successMessage = [];
                state.errorMessage = [];
            })
            .addCase(getBlogsByCategoryId.fulfilled, (state, action) => {
                state.latestBlogs = action.payload;
                state.singleBlog = null;
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = false;
                state.successMessage = [];
                state.errorMessage = [];
            })
            .addCase(getBlogsByCategoryId.rejected, (state, action) => {
                state.latestBlogs = null;
                state.singleBlog = null;
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.successMessage = [];
                state.errorMessage = isValidJSON(action.payload) ? Object.values(JSON.parse(action.payload)) : [action.payload];;
            })
            .addCase(getBlogsOfUser.fulfilled, (state, action) => {
                state.blogsOfUser = action.payload;
                state.singleBlog = null;
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = false;
                state.successMessage = [];
                state.errorMessage = [];
            })
            .addCase(getBlogsOfUser.rejected, (state, action) => {
                state.latestBlogs = null;
                state.blogsOfUser = null;
                state.singleBlog = null;
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.successMessage = [];
                state.errorMessage = isValidJSON(action.payload) ? Object.values(JSON.parse(action.payload)) : [action.payload];;
            })

            .addCase(getBlogByBlogID.pending, (state, action) => {
                state.singleBlog = null;
                state.isLoading = true;
                state.isSuccess = false;
                state.isError = false;
                state.successMessage = [];
                state.errorMessage = [];
            })
            .addCase(getBlogByBlogID.fulfilled, (state, action) => {
                if (action.payload.message) {
                    state.singleBlog = null;
                }
                else {
                    state.singleBlog = action.payload;
                }
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                state.successMessage = [];
                state.errorMessage = [];
            })
            .addCase(getBlogByBlogID.rejected, (state, action) => {
                state.singleBlog = null;
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.successMessage = [];
                state.errorMessage = isValidJSON(action.payload) ? Object.values(JSON.parse(action.payload)) : [action.payload];
            })
            .addCase(likeBlogByBlogID.fulfilled, (state, action) => {
                state.singleBlog = action.payload;
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.successMessage = [];
                state.errorMessage = []
            })
            .addCase(dislikeBlogByBlogID.fulfilled, (state, action) => {
                state.singleBlog = action.payload;
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.successMessage = [];
                state.errorMessage = []
            })
            .addCase(commentBlogByBlogID.fulfilled, (state, action) => {
                state.singleBlog = action.payload;
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.successMessage = [];
                state.errorMessage = []
            })
            .addCase(commentBlogByBlogID.rejected, (state, action) => {
                state.singleBlog = null;
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.successMessage = [];
                state.errorMessage = [action.payload]
            })
            .addCase(deleteCommentBlogByBlogID.fulfilled, (state, action) => {
                state.singleBlog = action.payload;
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                state.successMessage = [];
                state.errorMessage = []
            })
            .addCase(deleteCommentBlogByBlogID.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.successMessage = [];
                state.errorMessage = [action.payload]
            })
    }
})

export const { blogReset, blogResetLogout } = blogSlice.actions;
export default blogSlice.reducer;