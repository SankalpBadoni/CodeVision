import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/AuthSlice.js';
import projectReducer from './slices/ProjectSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer
  },
});