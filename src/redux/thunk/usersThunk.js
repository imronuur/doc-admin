import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createUser = createAsyncThunk('user/createOrUpdate', async ({ user, authToken }) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: authToken
  };
  const res = await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/admin-add-user`,
    { user },
    {
      headers
    }
  );
  return res;
});

export const deleteUser = createAsyncThunk('user/delete', async ({ _id, authToken, userEmail }) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: authToken,
    email: userEmail
  };
  const res = await axios.delete(`${process.env.REACT_APP_BACKEND_API}/users/${_id}`, {
    headers
  });
  return res;
});

export const deleteManyUsers = createAsyncThunk('user/delete-many', async ({ ids, authToken }) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: authToken
  };
  const res = await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/users-delete-many`,
    { ids },
    {
      headers
    }
  );
  return res;
});
