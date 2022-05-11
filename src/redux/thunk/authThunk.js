import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createOrUpdateUser = createAsyncThunk('auth/createOrUpdateuser', async (accessToken) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: accessToken
  };
  const res = await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/users`,
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
    `${process.env.REACT_APP_BACKEND_API}/users/token-check`,
    {},
    {
      headers
    }
  );
  return res;
});

export const getUser = createAsyncThunk('auth/getUser', async (accessToken) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: accessToken
  };
  const res = await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/login-user`,
    {},
    {
      headers
    }
  );
  return res;
});
