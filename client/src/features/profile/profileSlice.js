import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { isValidJSON } from '../../app/helpers';

import profileService from './profileService';

const initialState = {
    profile: null,
    isError: false,
    isSuccess: false,
    errorMessage: [],
    successMessage: [],
    isLoading: false
}

// Get My Profile
export const getMyProfile = createAsyncThunk('profile/me', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await profileService.getMyProfile(token);
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
            state.isError = false;
            state.isSuccess = false;
            state.errorMessage = [];
            state.successMessage = [];
            state.isLoading = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMyProfile.pending, (state, action) => {
                state.profile = null;
                state.isError = false;
                state.isSuccess = false;
                state.errorMessage = [];
                state.successMessage = [];
                state.isLoading = true;
            })
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
    }
})

export const { profileReset } = profileSlice.actions;
export default profileSlice.reducer;