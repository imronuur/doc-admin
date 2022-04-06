import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createCoupon = createAsyncThunk('coupon/create', async ({ coupon }) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  const res = await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/coupon-code`,
    { coupon },
    {
      headers
    }
  );
  return res;
});

export const deleteSubCategory = createAsyncThunk('subCategory/delete', async ({ slug }) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  const res = await axios.delete(`${process.env.REACT_APP_BACKEND_API}/sub-category/${slug}`, {
    headers
  });
  return res;
});

export const deleteManySubCategories = createAsyncThunk('subCategory/delete-many', async ({ ids }) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  const res = await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/sub-category-delete-many`,
    { ids },
    {
      headers
    }
  );
  return res;
});
