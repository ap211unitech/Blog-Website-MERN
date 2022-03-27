import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import profileReducer from '../features/profile/profileSlice';
import blogReducer from '../features/blog/blogSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    blog: blogReducer
  },
});
