import { configureStore } from '@reduxjs/toolkit';
import coiReducer from './coiSlice';

export const store = configureStore({
  reducer: {
    coi: coiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'coi/addCOI',
          'coi/updateCOI',
          'coi/sendReminder',
          'coi/sendBulkReminders',
          'coi/reinitializeData',
          'coi/resetToInitial'
        ],
        ignoredPaths: [
          'coi.coiData',
          'coi.properties',
          'coi.selectedCOI'
        ]
      },
      thunk: true,
    }),
  // eslint-disable-next-line no-undef
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;