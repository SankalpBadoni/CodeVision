import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
  userEmail: localStorage.getItem('userEmail') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.userEmail = action.payload;
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', action.payload);
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userEmail = null;
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userEmail');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;