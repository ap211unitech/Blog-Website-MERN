import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';
import { isValidJSON } from '../../app/helpers';

const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
    user: user ? user : null,
    isError: false,
    isSuccess: false,
    errorMessage: [],
    successMessage: [],
    isLoading: false
}

// Register User with form data
export const registerUserForm = createAsyncThunk('auth/registerForm', async (user, thunkAPI) => {
    try {
        return await authService.registerUserForm(user);
    } catch (err) {
        const message = (err.response && err.response.data && err.response.data.message) || err.message || err.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

// Login User with form data
export const loginUserForm = createAsyncThunk('auth/loginForm', async (user, thunkAPI) => {
    try {
        return await authService.loginUserForm(user);
    } catch (err) {
        const message = (err.response && err.response.data && err.response.data.message) || err.message || err.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

// Logout User
export const logout = createAsyncThunk('auth/logout', async (user, thunkAPI) => {
    try {
        return await authService.logout(user);
    } catch (err) {
        const message = (err.response && err.response.data && err.response.data.message) || err.message || err.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        authReset: (state) => {
            state.user = null;
            state.isError = false;
            state.isSuccess = false;
            state.errorMessage = [];
            state.successMessage = [];
            state.isLoading = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUserForm.pending, (state, action) => {
                state.user = null;
                state.isError = false;
                state.isSuccess = false;
                state.errorMessage = [];
                state.successMessage = [];
                state.isLoading = true;
            })
            .addCase(registerUserForm.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isError = false;
                state.isSuccess = true;
                state.errorMessage = [];
                state.successMessage = [];
                state.isLoading = false;
            })
            .addCase(registerUserForm.rejected, (state, action) => {
                state.user = null;
                state.isError = true;
                state.isSuccess = false;
                state.errorMessage = isValidJSON(action.payload) ? Object.values(JSON.parse(action.payload)) : [action.payload];
                state.successMessage = [];
                state.isLoading = false;
            })
            .addCase(loginUserForm.pending, (state, action) => {
                state.user = null;
                state.isError = false;
                state.isSuccess = false;
                state.errorMessage = [];
                state.successMessage = [];
                state.isLoading = true;
            })
            .addCase(loginUserForm.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isError = false;
                state.isSuccess = true;
                state.errorMessage = [];
                state.successMessage = [];
                state.isLoading = false;
            })
            .addCase(loginUserForm.rejected, (state, action) => {
                state.user = null;
                state.isError = true;
                state.isSuccess = false;
                state.errorMessage = isValidJSON(action.payload) ? Object.values(JSON.parse(action.payload)) : [action.payload];
                state.successMessage = [];
                state.isLoading = false;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.isError = false;
                state.isSuccess = false;
                state.errorMessage = [];
                state.successMessage = [];
                state.isLoading = false;
            })
    }
})

export const { authReset } = authSlice.actions;
export default authSlice.reducer;