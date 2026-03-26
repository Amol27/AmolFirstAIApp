import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  invoices: [],
  isLoading: false,
  error: null,
};

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    setInvoices: (state, action) => {
      state.invoices = action.payload;
    },
    addInvoice: (state, action) => {
      // Keep for backward compatibility, but data will be managed by Firestore
      const newInvoice = {
        id: Date.now().toString(),
        ...action.payload,
        createdAt: new Date().toISOString(),
      };
      state.invoices.unshift(newInvoice);
    },
    deleteInvoice: (state, action) => {
      // Keep for backward compatibility, but data will be managed by Firestore
      state.invoices = state.invoices.filter(invoice => invoice.id !== action.payload);
    },
    updateInvoice: (state, action) => {
      // Keep for backward compatibility, but data will be managed by Firestore
      const { id, ...updatedData } = action.payload;
      const index = state.invoices.findIndex(invoice => invoice.id === id);
      if (index !== -1) {
        state.invoices[index] = { ...state.invoices[index], ...updatedData };
      }
    },
    clearInvoices: (state) => {
      state.invoices = [];
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setInvoices,
  addInvoice,
  deleteInvoice,
  updateInvoice,
  clearInvoices,
  setLoading,
  setError,
} = invoiceSlice.actions;

export default invoiceSlice.reducer;
