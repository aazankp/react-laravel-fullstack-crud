import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user_id: null,
  user_name: null,
  user_email: null,
  token: localStorage.getItem('token') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user_id = action.payload.user_id;
      state.user_name = action.payload.user_name;
      state.user_email = action.payload.user_email;
      localStorage.setItem('token', action.payload.token);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user_id = null;
      state.user_name = null;
      state.user_email = null;
      localStorage.removeItem('token');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;