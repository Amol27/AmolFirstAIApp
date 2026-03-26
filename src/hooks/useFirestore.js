import { useState, useEffect, useCallback } from 'react';
import { invoiceService } from '../services/firestoreService';

export const useFirestore = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get all invoices for logged-in user
  const getInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await invoiceService.getInvoices();
      if (!result.success) {
        setError(result.error);
        return [];
      }
      return result.data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Get single invoice by ID
  const getInvoiceById = useCallback(async (invoiceId) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await invoiceService.getInvoiceById(invoiceId);
      if (!result.success) {
        setError(result.error);
        return null;
      }
      return result.data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Save new invoice
  const saveInvoice = useCallback(async (invoiceData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await invoiceService.saveInvoice(invoiceData);
      if (!result.success) {
        setError(result.error);
        return null;
      }
      return result.data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update existing invoice
  const updateInvoice = useCallback(async (invoiceId, invoiceData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await invoiceService.updateInvoice(invoiceId, invoiceData);
      if (!result.success) {
        setError(result.error);
        return null;
      }
      return result.data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete invoice
  const deleteInvoice = useCallback(async (invoiceId) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await invoiceService.deleteInvoice(invoiceId);
      if (!result.success) {
        setError(result.error);
        return false;
      }
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getInvoices,
    getInvoiceById,
    saveInvoice,
    updateInvoice,
    deleteInvoice,
  };
};

// Hook for real-time data
export const useRealtimeInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = invoiceService.onInvoicesChange((result) => {
      if (result.success) {
        setInvoices(result.data);
        setError(null);
      } else {
        setError(result.error);
      }
      setLoading(false);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return { invoices, loading, error };
};
