import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createOffer = createAsyncThunk('offer/create', async ({ offer }) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  const res = await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/super-offer`,
    { offer },
    {
      headers
    }
  );
  return res;
});

export const deleteOffer = createAsyncThunk('offer/delete', async ({ _id }) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  const res = await axios.delete(`${process.env.REACT_APP_BACKEND_API}/super-offer/${_id}`, {
    headers
  });
  return res;
});

export const deleteManyOffers = createAsyncThunk('offers/delete-many', async ({ ids }) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  const res = await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/super-offer-delete-many`,
    { ids },
    {
      headers
    }
  );
  return res;
});
