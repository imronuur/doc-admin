import { createSlice } from '@reduxjs/toolkit';
import camelize from 'camelize';

const initialState = {
  bulkProducts: []
};

const transformDataToCamelCase = (data) => camelize(data);

const slice = createSlice({
  name: 'bulkProduct',
  initialState,
  reducers: {
    loadBulkProducts: (state, { payload }) => {
      state.bulkProducts = transformDataToCamelCase(payload);
    },
    removeBulkProducts: (state, { payload }) => {
      state.bulkProducts = payload;
    }
  }
});

export const { loadBulkProducts, removeBulkProducts } = slice.actions;

// Reducer
export default slice.reducer;
