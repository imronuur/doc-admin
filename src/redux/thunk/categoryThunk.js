import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createCategory = createAsyncThunk('category/create', async ({ name }) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  const res = await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/category`,
    { name },
    {
      headers
    }
  );
  return res;
});

export const deleteCategory = createAsyncThunk('category/delete', async ({ slug }) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  const res = await axios.delete(`${process.env.REACT_APP_BACKEND_API}/category/${slug}`, {
    headers
  });
  return res;
});
