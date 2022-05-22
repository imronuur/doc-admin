import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createCoupon = createAsyncThunk('coupon/create', async ({ codes, accessToken }) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: accessToken
  };
  const res = await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/coupon-code`,
    { codes },
    {
      headers
    }
  );
  return res;
});

export const deleteCoupon = createAsyncThunk('coupon/delete', async ({ _id, accessToken }) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: accessToken
  };
  const res = await axios.delete(`${process.env.REACT_APP_BACKEND_API}/coupon-code/${_id}`, {
    headers
  });
  return res;
});

export const deleteManyCoupons = createAsyncThunk('coupon/delete-many', async ({ ids, accessToken }) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: accessToken
  };
  const res = await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/coupon-code-delete-many`,
    { ids },
    {
      headers
    }
  );
  return res;
});
