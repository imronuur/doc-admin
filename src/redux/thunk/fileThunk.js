import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const uploadFile = createAsyncThunk('file/create', async ({ image }) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  const res = await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/upload-images`,
    { image },
    {
      headers
    }
  );
  return res;
});

export const removeFile = createAsyncThunk('file/delete', async ({ public_id }) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  const res = await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/remove-file`,
    {
      public_id
    },
    {
      headers
    }
  );
  return res;
});
