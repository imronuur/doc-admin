import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from 'axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  users: {
    data: [],
    currentPage: null,
    numberOfPages: null
  }
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },

    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    getUsersSuccess(state, action) {
      state.isLoading = false;
      state.users = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getUsers({ page, authToken }) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: authToken
  };
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_API}/users?page=${page}`, { headers });
      dispatch(slice.actions.getUsersSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export async function getAllUsers({ accessToken }) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: accessToken
  };
  try {
    const res = await axios.get(`${process.env.REACT_APP_BACKEND_API}/get-all-users`, { headers });
    return res.data;
  } catch (error) {
    return error.message;
  }
}
