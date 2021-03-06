import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createInvoice = createAsyncThunk('invoice/create', async ({ invoice, accessToken }) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: accessToken
  };
  const res = await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/invoices`,
    { invoice },
    {
      headers
    }
  );
  return res;
});

export const deleteInvoice = createAsyncThunk('invoice/delete', async ({ _id, accessToken }) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: accessToken
  };
  const res = await axios.delete(`${process.env.REACT_APP_BACKEND_API}/invoice/${_id}`, {
    headers
  });
  return res;
});

export const deleteManyInvoices = createAsyncThunk('invoices/delete-many', async ({ ids, accessToken }) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: accessToken
  };
  const res = await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/invoices-delete-many`,
    { ids },
    {
      headers
    }
  );
  return res;
});
