import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { isValidJSON } from "../../app/helpers";
import categoryService from "./categoryService";

const initialState = {
    categories: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    successMessage: [],
    errorMessage: []
}


// Get all category
export const getAllCategory = createAsyncThunk('/category/get', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth?.user?.token;
        return await categoryService.getAllCategory(token);
    } catch (err) {
        const message = (err.response && err.response.data && err.response.data.message) || err.message || err.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        categoryReset: (state, action) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.successMessage = [];
            state.errorMessage = [];
        },
        categoryLogout: (state, action) => {
            state.categories = null;
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.successMessage = [];
            state.errorMessage = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllCategory.pending, (state, action) => {
                state.categories = null;
                state.isLoading = true;
                state.isSuccess = false;
                state.isError = false;
                state.successMessage = [];
                state.errorMessage = [];
            })
            .addCase(getAllCategory.fulfilled, (state, action) => {
                state.categories = action.payload;
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = false;
                state.successMessage = [];
                state.errorMessage = [];
            })
            .addCase(getAllCategory.rejected, (state, action) => {
                state.categories = null;
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.successMessage = [];
                state.errorMessage = isValidJSON(action.payload) ? Object.values(JSON.parse(action.payload)) : [action.payload];;
            })
    }
})

export const { categoryLogout, categoryReset } = categorySlice.actions;
export default categorySlice.reducer;