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

// Forgot Password ( Sends Email )
export const forgotPassword = createAsyncThunk('/auth/forgotPassword', async (email, thunkAPI) => {
    try {
        return await authService.forgotPassword(email);
    } catch (err) {
        const message = (err.response && err.response.data && err.response.data.message) || err.message || err.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

// Reset Password
export const resetPassword = createAsyncThunk('/auth/resetPassword', async ({ newPassword, token }, thunkAPI) => {
    try {
        return await authService.resetPassword({ newPassword, token });
    } catch (err) {
        const message = (err.response && err.response.data && err.response.data.message) || err.message || err.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

// Activate Account
export const activateAccount = createAsyncThunk('/auth/activateAccount', async ({ token }, thunkAPI) => {
    try {
        const authToken =  thunkAPI.getState().auth?.user?.token;
        return await authService.activateAccount({ token, authToken });
    } catch (err) {
        const message = (err.response && err.response.data && err.response.data.message) || err.message || err.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

// Send Activation Mail again
export const sendActivationMail = createAsyncThunk('/auth/sendActivationMail', async (_, thunkAPI) => {
    try {
        const authToken =  thunkAPI.getState().auth?.user?.token;
        return await authService.sendActivationMail({ authToken });
    } catch (err) {
        const message = (err.response && err.response.data && err.response.data.message) || err.message || err.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

// Google SignIn Authentication
export const googleSignInAuthentication = createAsyncThunk('/auth/googleSignIn', async (idToken, thunkAPI) => {
    try {
        return await authService.googleSignInAuthentication({ idToken });
    } catch (err) {
        const message = (err.response && err.response.data && err.response.data.message) || err.message || err.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

// Change Password
export const changePassword = createAsyncThunk('/auth/changePassword', async (data, thunkAPI) => {
    try {
        const authToken =  thunkAPI.getState().auth?.user?.token;
        return await authService.changePassword(data, authToken);
    } catch (err) {
        const message = (err.response && err.response.data && err.response.data.message) || err.message || err.toString();
        return thunkAPI.rejectWithValue(message);
    }
})


// Set Custom Auth
export const setAuth = createAsyncThunk('/auth/set', async (user, thunkAPI) => {
    return user;
})

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        authReset: (state) => {
            let user = JSON.parse(localStorage.getItem('user'));
            state.user = user ? user : null;
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
            .addCase(forgotPassword.pending, (state, action) => {
                state.user = null;
                state.isError = false;
                state.isSuccess = false;
                state.errorMessage = [];
                state.successMessage = [];
                state.isLoading = true;
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.user = null;
                state.isError = false;
                state.isSuccess = true;
                state.errorMessage = [];
                state.successMessage = ['Reset Link sent to your email'];
                state.isLoading = false;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.user = null;
                state.isError = true;
                state.isSuccess = false;
                state.errorMessage = isValidJSON(action.payload) ? Object.values(JSON.parse(action.payload)) : [action.payload];
                state.successMessage = [];
                state.isLoading = false;
            })
            .addCase(resetPassword.pending, (state, action) => {
                state.user = null;
                state.isError = false;
                state.isSuccess = false;
                state.errorMessage = [];
                state.successMessage = [];
                state.isLoading = true;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.user = null;
                state.isError = false;
                state.isSuccess = true;
                state.errorMessage = [];
                state.successMessage = [action.payload.msg];
                state.isLoading = false;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.user = null;
                state.isError = true;
                state.isSuccess = false;
                state.errorMessage = isValidJSON(action.payload) ? Object.values(JSON.parse(action.payload)) : [action.payload];
                state.successMessage = [];
                state.isLoading = false;
            })
            .addCase(activateAccount.pending, (state, action) => {
                state.isError = false;
                state.isSuccess = false;
                state.errorMessage = [];
                state.successMessage = [];
                state.isLoading = true;
            })
            .addCase(activateAccount.fulfilled, (state, action) => {
                state.isError = false;
                state.isSuccess = true;
                state.errorMessage = [];
                state.successMessage = ['Account verified successfully'];
                state.isLoading = false;
            })
            .addCase(activateAccount.rejected, (state, action) => {
                state.isError = true;
                state.isSuccess = false;
                state.errorMessage = isValidJSON(action.payload) ? Object.values(JSON.parse(action.payload)) : [action.payload];
                state.successMessage = [];
                state.isLoading = false;
            })
            .addCase(sendActivationMail.pending, (state, action) => {
                state.isError = false;
                state.isSuccess = false;
                state.errorMessage = [];
                state.successMessage = [];
                state.isLoading = true;
            })
            .addCase(sendActivationMail.fulfilled, (state, action) => {
                state.isError = false;
                state.isSuccess = true;
                state.errorMessage = [];
                state.successMessage = [action.payload.msg];
                state.isLoading = false;
            })
            .addCase(sendActivationMail.rejected, (state, action) => {
                state.isError = true;
                state.isSuccess = false;
                state.errorMessage = isValidJSON(action.payload) ? Object.values(JSON.parse(action.payload)) : [action.payload];
                state.successMessage = [];
                state.isLoading = false;
            })
            .addCase(googleSignInAuthentication.pending, (state, action) => {
                state.user = null;
                state.isError = false;
                state.isSuccess = false;
                state.errorMessage = [];
                state.successMessage = [];
                state.isLoading = true;
            })
            .addCase(googleSignInAuthentication.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isError = false;
                state.isSuccess = true;
                state.errorMessage = [];
                state.successMessage = [];
                state.isLoading = false;
            })
            .addCase(googleSignInAuthentication.rejected, (state, action) => {
                state.user = null;
                state.isError = true;
                state.isSuccess = false;
                state.errorMessage = isValidJSON(action.payload) ? Object.values(JSON.parse(action.payload)) : [action.payload];
                state.successMessage = [];
                state.isLoading = false;
            })
            .addCase(setAuth.fulfilled, (state, action) => {
                const obj = { token: state.user.token, ...action.payload.payload.user }
                localStorage.setItem('user', JSON.stringify(obj));
                state.user = obj;
            })
            .addCase(changePassword.pending, (state, action) => {
                state.isError = false;
                state.isSuccess = false;
                state.errorMessage = [];
                state.successMessage = [];
                state.isLoading = true;
            })
            .addCase(changePassword.fulfilled, (state, action) => {
                state.isError = false;
                state.isSuccess = true;
                state.errorMessage = [];
                state.successMessage = ['Password changed successfully.'];
                state.isLoading = false;
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.isError = true;
                state.isSuccess = false;
                state.errorMessage = isValidJSON(action.payload) ? Object.values(JSON.parse(action.payload)) : [action.payload];
                state.successMessage = [];
                state.isLoading = false;
            })

    }
})

export const { authReset } = authSlice.actions;
export default authSlice.reducer;