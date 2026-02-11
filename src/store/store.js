// store/store.js
import { configureStore } from '@reduxjs/toolkit';
import coiReducer from './coiSlice';

export const store = configureStore({
  reducer: {
    coi: coiReducer,
  },
});