import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from 'axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  brands: {
    data: [],
    currentPage: null,
    numberOfPages: null
  }
};

const slice = createSlice({
  name: 'brands',
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },

    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    getBrandsSuccess(state, action) {
      state.isLoading = false;
      state.brands = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getBrands({ page, accessToken }) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: accessToken
  };
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_API}/brands?page=${page}`, { headers });
      dispatch(slice.actions.getBrandsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
