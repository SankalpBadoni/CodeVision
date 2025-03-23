import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/AuthSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});