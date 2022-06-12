import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createOrUpdateBlog = createAsyncThunk('article/create', async ({ article, accessToken }) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: accessToken
  };
  const res = await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/article`,
    { article },
    {
      headers
    }
  );
  return res;
});

export const deleteBlog = createAsyncThunk('article/delete', async ({ _id, accessToken }) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: accessToken
  };
  const res = await axios.delete(`${process.env.REACT_APP_BACKEND_API}/article/${_id}`, {
    headers
  });
  return res;
});

export const deleteManyBlogs = createAsyncThunk('article/delete-many', async ({ ids, accessToken }) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: accessToken
  };
  const res = await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/articles-delete-many`,
    { ids },
    {
      headers
    }
  );
  return res;
});
