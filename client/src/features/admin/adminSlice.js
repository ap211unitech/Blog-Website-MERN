import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminService from './adminService';
import { isValidJSON } from '../../app/helpers';

const initialState = {
    usersList: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    successMessage: [],
    errorMessage: []
}

// Get All Users list 
export const getAllUsers = createAsyncThunk('/admin/getAllUsers', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth?.user?.token;
        return await adminService.getAllUsers(token);
    } catch (err) {
        const message = (err.response && err.response.data && err.response.data.message) || err.message || err.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

// Toggle User Role
export const toggleUserRole = createAsyncThunk('/admin/toggleRole', async (data, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth?.user?.token;
        return await adminService.toggleRole(token, data);
    } catch (err) {
        const message = (err.response && err.response.data && err.response.data.message) || err.message || err.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

// Toggle User Block
export const toggleUserBlock = createAsyncThunk('/admin/toggleBlock', async (data, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth?.user?.token;
        return await adminService.toggleBlock(token, data);
    } catch (err) {
        const message = (err.response && err.response.data && err.response.data.message) || err.message || err.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

// Get user all details by userid 
export const getUserDetails = createAsyncThunk('/admin/getUserDetails', async (data, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth?.user?.token;
        return await adminService.getUserDetails(token, data);
    } catch (err) {
        const message = (err.response && err.response.data && err.response.data.message) || err.message || err.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        adminLogout: (state, action) => {
            state.usersList = null;
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.successMessage = [];
            state.errorMessage = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllUsers.pending, (state, action) => {
                state.usersList = [];
                state.isLoading = true;
                state.isSuccess = false;
                state.isError = false;
                state.successMessage = [];
                state.errorMessage = [];
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.usersList = action.payload;
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                state.successMessage = [];
                state.errorMessage = [];
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.usersList = [];
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.successMessage = [];
                state.errorMessage = isValidJSON(action.payload) ? Object.values(JSON.parse(action.payload)) : [action.payload];
            })
    }
})


export const { adminLogout } = adminSlice.actions;
export default adminSlice.reducer;