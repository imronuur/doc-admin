import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createRole = createAsyncThunk('role/createOrUpdate', async ({ role, authToken }) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: authToken
  };
  const res = await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/roles`,
    { role },
    {
      headers
    }
  );
  return res;
});

export const deleteRole = createAsyncThunk('role/delete', async ({ _id, authToken }) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: authToken
  };
  const res = await axios.delete(`${process.env.REACT_APP_BACKEND_API}/role/${_id}`, {
    headers
  });
  return res;
});

export const addRolePermissions = createAsyncThunk('role/addPermissions', async ({ permissions, authToken }) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: authToken
  };
  const res = await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/add-permissions-to-role`,
    { permissions },
    {
      headers
    }
  );
  return res;
});
