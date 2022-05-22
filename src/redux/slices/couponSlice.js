import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from 'axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  codes: {
    data: [],
    currentPage: null,
    numberOfPages: null
  }
};

const slice = createSlice({
  name: 'coupon',
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },

    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    getCouponSuccess(state, action) {
      state.isLoading = false;
      state.codes = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getCoupon({ page, accessToken }) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: accessToken
  };
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_API}/coupon-code?page=', ${page}`, { headers });
      dispatch(slice.actions.getCouponSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
