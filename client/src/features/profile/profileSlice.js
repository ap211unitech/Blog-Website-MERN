import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { isValidJSON } from '../../app/helpers';

import profileService from './profileService';

const initialState = {
    profile: null,
    otherProfile: null,
    isError: false,
    isSuccess: false,
    errorMessage: [],
    successMessage: [],
    isLoading: false
}

// Get My Profile
export const getMyProfile = createAsyncThunk('profile/me', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth?.user?.token;
        return await profileService.getMyProfile(token);
    } catch (err) {
        const message = (err.response && err.response.data && err.response.data.message) || err.message || err.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

// Edit My Profile
export const editMyProfile = createAsyncThunk('profile/edit', async (data, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth?.user?.token;
        return await profileService.editMyProfile(token, data);
    } catch (err) {
        const message = (err.response && err.response.data && err.response.data.message) || err.message || err.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

// Get Any user profile
export const getAnyUserProfile = createAsyncThunk('profile/anyuser', async (profileId, thunkAPI) => {
    try {
        return await profileService.getAnyUserProfile(profileId);
    } catch (err) {
        const message = (err.response && err.response.data && err.response.data.message) || err.message || err.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

// Follow/Unfollow any user profile
export const followAnyUserProfile = createAsyncThunk('profile/follow', async (profileId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth?.user?.token;
        return await profileService.followAnyUserProfile(profileId, token);
    } catch (err) {
        const message = (err.response && err.response.data && err.response.data.message) || err.message || err.toString();
        return thunkAPI.rejectWithValue(message);
    }
})



export const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        profileReset: (state) => {
            state.profile = null;
            state.otherProfile = null;
            state.isError = false;
            state.isSuccess = false;
            state.errorMessage = [];
            state.successMessage = [];
            state.isLoading = false;
        },
        customProfileReset: (state) => {
            state.isError = false;
            state.isSuccess = false;
            state.errorMessage = [];
            state.successMessage = [];
            state.isLoading = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMyProfile.fulfilled, (state, action) => {
                state.profile = action.payload;
                state.isError = false;
                state.isSuccess = true;
                state.errorMessage = [];
                state.successMessage = [];
                state.isLoading = false;
            })
            .addCase(getMyProfile.rejected, (state, action) => {
                state.profile = null;
                state.isError = true;
                state.isSuccess = false;
                state.errorMessage = isValidJSON(action.payload) ? Object.values(JSON.parse(action.payload)) : [action.payload];
                state.successMessage = [];
                state.isLoading = false;
            })
            .addCase(editMyProfile.pending, (state, action) => {
                state.isError = false;
                state.isSuccess = false;
                state.errorMessage = [];
                state.successMessage = [];
                state.isLoading = true;
            })
            .addCase(editMyProfile.fulfilled, (state, action) => {
                state.profile = action.payload.profile
                state.isError = false;
                state.isSuccess = true;
                state.errorMessage = [];
                state.successMessage = ['Profile Updated'];
                state.isLoading = false;
            })
            .addCase(editMyProfile.rejected, (state, action) => {
                state.isError = true;
                state.isSuccess = false;
                state.errorMessage = isValidJSON(action.payload) ? Object.values(JSON.parse(action.payload)) : [action.payload];
                state.successMessage = [];
                state.isLoading = false;
            })
            .addCase(getAnyUserProfile.pending, (state, action) => {
                state.otherProfile = null;
                state.isError = false;
                state.isSuccess = false;
                state.errorMessage = [];
                state.successMessage = [];
                state.isLoading = true;
            })
            .addCase(getAnyUserProfile.fulfilled, (state, action) => {
                state.otherProfile = { profile: action.payload.profile, user: action.payload.user, blogs: action.payload.blogs }
                state.isError = false;
                state.isSuccess = true;
                state.errorMessage = [];
                state.successMessage = [];
                state.isLoading = false;
            })
            .addCase(getAnyUserProfile.rejected, (state, action) => {
                state.otherProfile = { profile: null, user: null, blog: null };
                state.isError = true;
                state.isSuccess = false;
                state.errorMessage = isValidJSON(action.payload) ? Object.values(JSON.parse(action.payload)) : [action.payload];
                state.successMessage = [];
                state.isLoading = false;
            })
            .addCase(followAnyUserProfile.fulfilled, (state, action) => {
                state.otherProfile = { ...state.otherProfile, profile: action.payload.profile }
                state.isError = false;
                state.isSuccess = true;
                state.errorMessage = [];
                state.successMessage = [];
                state.isLoading = false;
            })
            .addCase(followAnyUserProfile.rejected, (state, action) => {
                // state.otherProfile = { profile: null, user: null };
                state.isError = true;
                state.isSuccess = false;
                state.errorMessage = isValidJSON(action.payload) ? Object.values(JSON.parse(action.payload)) : [action.payload];
                state.successMessage = [];
                state.isLoading = false;
            })
    }
})

export const { profileReset, customProfileReset } = profileSlice.actions;
export default profileSlice.reducer;