import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
  userEmail: localStorage.getItem('userEmail') || null,
  username: localStorage.getItem('username') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.userEmail = action.payload.email;
      state.username = action.payload.username || action.payload.email.split('@')[0];
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', action.payload.email);
      localStorage.setItem('username', state.username);
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userEmail = null;
      state.username = null;
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('username');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;