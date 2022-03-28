import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { isValidJSON } from "../../app/helpers";
import blogService from "./blogService";

const initialState = {
    latestBlogs: null,
    singleBlog: null,
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

// Get Blog by blogID
export const getBlogByBlogID = createAsyncThunk('/blog/single', async (blogId, thunkAPI) => {
    try {
        return await blogService.getBlogByBlogID(blogId);
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
                state.isSuccess = false;
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



    }
})

export const { blogReset, blogResetLogout } = blogSlice.actions;
export default blogSlice.reducer;