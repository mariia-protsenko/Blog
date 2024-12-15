import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchAllComments = createAsyncThunk('posts/fetchAllComments', async () => {
  const { data } = await axios.get('/comments');

  return data;
});

export const fetchPostComments = createAsyncThunk('posts/fetchPostComments', async (id) => {
  const { data } = await axios.get(`/posts/${id}/comments`);

  return data;
});

const initialState = {
  items: [],
  status: 'loading',
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllComments.pending, (state) => {
        state.status = 'loading';
        state.items = [];
      })
      .addCase(fetchAllComments.fulfilled, (state, action) => {
        state.status = 'loaded';
        state.items = action.payload;
      })
      .addCase(fetchAllComments.rejected, (state) => {
        state.status = 'error';
        state.items = [];
      })
      .addCase(fetchPostComments.pending, (state) => {
        state.status = 'loading';
        state.items = [];
      })
      .addCase(fetchPostComments.fulfilled, (state, action) => {
        state.status = 'loaded';
        state.items = action.payload;
      })
      .addCase(fetchPostComments.rejected, (state) => {
        state.status = 'error';
        state.items = [];
      });
  },
});

export const commentsReducer = commentsSlice.reducer;
