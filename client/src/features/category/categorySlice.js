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

// Delete a category
export const deleteCategory = createAsyncThunk('/category/delete', async (data, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth?.user?.token;
        return await categoryService.deleteCategory(data, token);
    } catch (err) {
        const message = (err.response && err.response.data && err.response.data.message) || err.message || err.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

// Add a new category
export const addCategory = createAsyncThunk('/category/create', async (data, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth?.user?.token;
        return await categoryService.addCategory(data, token);
    } catch (err) {
        const message = (err.response && err.response.data && err.response.data.message) || err.message || err.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

// Edit category
export const editCategoryAction = createAsyncThunk('/category/edit', async (data, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth?.user?.token;
        return await categoryService.editCategory(data, token);
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
            state.categories = null;
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
                state.isSuccess = true;
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
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.categories = state.categories.filter(c => c._id.toString() !== action.payload.category._id);
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = false;
                state.successMessage = [];
                state.errorMessage = [];
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.successMessage = [];
                state.errorMessage = isValidJSON(action.payload) ? Object.values(JSON.parse(action.payload)) : [action.payload];;
            })
            .addCase(addCategory.fulfilled, (state, action) => {
                state.categories = [action.payload, ...state.categories];
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = false;
                state.successMessage = [];
                state.errorMessage = [];
            })
            .addCase(editCategoryAction.fulfilled, (state, action) => {
                const result = state.categories.map(cat => cat._id.toString() === action.payload._id.toString() ? { ...cat, name: action.payload.name } : cat);
                state.categories = result
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = false;
                state.successMessage = [];
                state.errorMessage = [];
            })
            .addCase(editCategoryAction.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.successMessage = [];
                state.errorMessage = isValidJSON(action.payload) ? Object.values(JSON.parse(action.payload)) : [action.payload];
            })

    }
})

export const { categoryLogout, categoryReset } = categorySlice.actions;
export default categorySlice.reducer;