import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import profileReducer from '../features/profile/profileSlice';
import blogReducer from '../features/blog/blogSlice';
import categoryReducer from '../features/category/categorySlice';
import adminReducer from '../features/admin/adminSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    blog: blogReducer,
    category: categoryReducer,
    admin: adminReducer
  },
});
