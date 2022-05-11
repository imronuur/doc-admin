import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from 'axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  invoices: {
    data: [],
    currentPage: null,
    numberOfPages: null
  }
};

const slice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },

    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    getInvoicesSuccess(state, action) {
      state.isLoading = false;
      state.invoices = action.payload;
    },
    getInvoiceTotal(state) {
      let total = 0;
      state.invoices.data.items?.forEach((item) => {
        const totalPrice = Number(item.quantity) * Number(item.unitPrice);
        total += totalPrice - totalPrice * (Number(item.discount) / 100);
      });

      state.invoices.data.map((item) => (item.total = total));
    }
  }
});

// Reducer
export default slice.reducer;
export const { getInvoiceTotal } = slice.actions;

// ----------------------------------------------------------------------

export function getInvoice({ page }) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_API}/invoices?page=${page}`);
      dispatch(slice.actions.getInvoicesSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
