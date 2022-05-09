import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from 'axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  roles: {
    data: [],
    currentPage: null,
    numberOfPages: null
  }
};

const slice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },

    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    getRolesSuccess(state, action) {
      state.isLoading = false;
      state.roles = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getRoles({ page }) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_API}/roles?page=${page}`);
      dispatch(slice.actions.getRolesSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
