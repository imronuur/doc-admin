import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from 'axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  subCategories: {
    data: [],
    currentPage: null,
    numberOfPages: null
  }
};

const slice = createSlice({
  name: 'subCategory',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET PRODUCTS
    getSubCategoriesSuccess(state, action) {
      state.isLoading = false;
      state.subCategories = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getSubCategories({ page, authToken }) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: authToken
  };
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_API}/sub-categories?page=${page}`, { headers });
      dispatch(slice.actions.getSubCategoriesSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export const getAllCategories = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_API}/categories/list-all`);
    return response;
  } catch (error) {
    return error.message;
  }
};

export const getAllSubCategories = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_API}/sub-categories/list-all`);
    return response;
  } catch (error) {
    return error.message;
  }
};

export const loadSubCategory = async (_id) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_API}/category/get-sub/${_id}`);
    return response;
  } catch (error) {
    return error.message;
  }
};

// ----------------------------------------------------------------------

export function getProduct(name) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/products/product', {
        params: { name }
      });
      dispatch(slice.actions.getProductSuccess(response.data.product));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}
