import { createSlice } from '@reduxjs/toolkit';
import { getUser } from '../thunk/authThunk';

const initialState = {
  isLoading: false,
  error: false,
  user: {
    role: '',
    _id: '',
    name: '',
    email: ''
  },
  isAuthenticated: false,
  token: null
};

const slice = createSlice({
  name: 'auth',
  initialState,
  extraReducers: {
    [getUser.pending]: (state) => {
      state.isLoading = true;
    },
    [getUser.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.user = payload.data.user;
      state.isAuthenticated = true;
      state.token = payload.data.authorization;
    },
    [getUser.rejected]: (state, { error }) => {
      state.error = error.message;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.user = initialState.user;
      state.token = null;
    }
  }
});

// Reducer
export default slice.reducer;
