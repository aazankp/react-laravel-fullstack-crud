import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: !!localStorage.getItem('token'),
  user_id: localStorage.getItem('user_id') || null,
  user_name: localStorage.getItem('user_name') || null,
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
      state.token = action.payload.token;

      localStorage.setItem('user_id', action.payload.user_id);
      localStorage.setItem('user_name', action.payload.user_name);
      localStorage.setItem('token', action.payload.token);
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.user_id = null;
      state.user_name = null;
      state.token = null;

      localStorage.removeItem('user_id');
      localStorage.removeItem('user_name');
      localStorage.removeItem('token');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;