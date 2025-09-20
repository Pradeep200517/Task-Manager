import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const res = await api.get('/posts');
  return res.data;
});
export const fetchPostById = createAsyncThunk('posts/fetchPostById', async (id) => {
  const res = await api.get(`/posts/${id}`);
  return res.data;
});
export const createPost = createAsyncThunk('posts/createPost', async (payload) => {
  const res = await api.post('/posts', payload);
  return res.data;
});
export const updatePost = createAsyncThunk('posts/updatePost', async ({ id, data }) => {
  const res = await api.put(`/posts/${id}`, data);
  return res.data;
});
export const deletePost = createAsyncThunk('posts/deletePost', async (id) => {
  await api.delete(`/posts/${id}`);
  return id;
});

const slice = createSlice({
  name: 'posts',
  initialState: { list: [], current: null, status: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.current = action.payload;
        state.list = state.list.map(p => p._id === action.payload._id ? action.payload : p);
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.list = state.list.filter(p => p._id !== action.payload);
      });
  }
});

export default slice.reducer;


