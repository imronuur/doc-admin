import { createSlice } from '@reduxjs/toolkit';
import camelize from 'camelize';

const initialState = {
  bulkCategories: []
};

const transformDataToCamelCase = (data) => camelize(data);

const slice = createSlice({
  name: 'bulkCategory',
  initialState,
  reducers: {
    loadBulkCategories: (state, { payload }) => {
      state.bulkCategories = transformDataToCamelCase(payload);
    },
    removeBulkCategories: (state, { payload }) => {
      state.bulkCategories = payload;
    }
  }
});

export const { loadBulkCategories, removeBulkCategories } = slice.actions;

// Reducer
export default slice.reducer;
