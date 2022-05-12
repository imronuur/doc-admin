import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createBrand = createAsyncThunk('brand/create', async ({ brand, accessToken }) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: accessToken
  };
  const res = await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/brands`,
    { brand },
    {
      headers
    }
  );
  return res;
});

export const deleteBrand = createAsyncThunk('brand/delete', async ({ _id, accessToken }) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: accessToken
  };
  const res = await axios.delete(`${process.env.REACT_APP_BACKEND_API}/brand/${_id}`, {
    headers
  });
  return res;
});

export const deleteManyBrands = createAsyncThunk('brands/delete-many', async ({ ids, accessToken }) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: accessToken
  };
  const res = await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/brands-delete-many`,
    { ids },
    {
      headers
    }
  );
  return res;
});
