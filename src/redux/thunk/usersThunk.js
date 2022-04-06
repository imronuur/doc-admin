import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createUser = createAsyncThunk('clients/create', async ({ user }) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  const res = await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/clients`,
    { user },
    {
      headers
    }
  );
  return res;
});

export const deleteUser = createAsyncThunk('clients/delete', async ({ _id }) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  const res = await axios.delete(`${process.env.REACT_APP_BACKEND_API}/clients/${_id}`, {
    headers
  });
  return res;
});

export const deleteManyClients = createAsyncThunk('clients/delete-many', async ({ ids }) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  const res = await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/clients-delete-many`,
    { ids },
    {
      headers
    }
  );
  return res;
});
