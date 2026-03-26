import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import invoiceSlice from './slices/invoiceSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    invoice: invoiceSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
