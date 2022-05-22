import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createProduct = createAsyncThunk('product/create', async ({ product, accessToken }) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: accessToken
  };
  const res = await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/product`,
    { product },
    {
      headers
    }
  );
  return res;
});

export const createBulkProduct = createAsyncThunk('product/create-bulk', async ({ products, accessToken }) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: accessToken
  };
  const res = await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/bulk-product`,
    { products },
    {
      headers
    }
  );
  return res;
});

export const deleteProduct = createAsyncThunk('product/delete', async ({ slug, accessToken }) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: accessToken
  };
  const res = await axios.delete(`${process.env.REACT_APP_BACKEND_API}/product/${slug}`, {
    headers
  });
  return res;
});

export const deleteManyProducts = createAsyncThunk('product/delete-many', async ({ ids, accessToken }) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: accessToken
  };
  const res = await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/product-delete-many`,
    { ids },
    {
      headers
    }
  );
  return res;
});
