import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createClient = createAsyncThunk('clients/create', async ({ client, accessToken }) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: accessToken
  };
  const res = await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/client`,
    { client },
    {
      headers
    }
  );
  return res;
});

export const deleteClient = createAsyncThunk('client/delete', async ({ _id, accessToken }) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: accessToken
  };
  const res = await axios.delete(`${process.env.REACT_APP_BACKEND_API}/client/${_id}`, {
    headers
  });
  return res;
});

export const deleteManyClients = createAsyncThunk('clients/delete-many', async ({ ids, accessToken }) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: accessToken
  };
  const res = await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/client-delete-many`,
    { ids },
    {
      headers
    }
  );
  return res;
});
