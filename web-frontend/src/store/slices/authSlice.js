import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

const token = localStorage.getItem('token');

export const login = createAsyncThunk('auth/login', async (credentials) => {
  const res = await api.post('/auth/login', credentials);
  return res.data;
});
export const register = createAsyncThunk('auth/register', async (payload) => {
  const res = await api.post('/auth/register', payload);
  return res.data;
});
export const fetchMe = createAsyncThunk('auth/fetchMe', async () => {
  const res = await api.get('/users/me');
  return res.data;
});

const initialState = {
  token: token || null,
  user: token ? JSON.parse(localStorage.getItem('user')) : null,
  status: 'idle'
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    setCredentials(state, action) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(register.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      });
  }
});

export const { logout, setCredentials } = slice.actions;
export default slice.reducer;


