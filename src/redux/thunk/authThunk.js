import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createOrUpdateUser = createAsyncThunk('auth/createOrUpdateuser', async (authToken) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: authToken.token
  };
  const res = await axios.post(
    `${process.env.REACT_APP_EXPRESS_BACKEND_API}/users`,
    {},
    {
      headers
    }
  );
  return res;
});

export const tokenCheck = createAsyncThunk('auth/checkToken', async (authToken) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: authToken
  };
  const res = await axios.post(
    `${process.env.REACT_APP_EXPRESS_BACKEND_API}/users/token_check`,
    {},
    {
      headers
    }
  );
  return res;
});
