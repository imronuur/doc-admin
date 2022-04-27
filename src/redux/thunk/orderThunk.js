import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createOrder = createAsyncThunk('order/create', async ({ order }) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  const res = await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/order`,
    { order },
    {
      headers
    }
  );
  return res;
});
export const updateOrderStatus = createAsyncThunk('update-order-status/create', async ({ status }) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  const res = await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/update-order-status`,
    { status },
    {
      headers
    }
  );
  return res;
});

export const deleteOrder = createAsyncThunk('order/delete', async ({ _id }) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  const res = await axios.delete(`${process.env.REACT_APP_BACKEND_API}/order/${_id}`, {
    headers
  });
  return res;
});

export const deleteManyOrders = createAsyncThunk('orders/delete-many', async ({ ids }) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  const res = await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/orders-delete-many`,
    { ids },
    {
      headers
    }
  );
  return res;
});
