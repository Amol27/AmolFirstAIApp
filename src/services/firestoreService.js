import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const INVOICES_COLLECTION = 'invoices';

export const invoiceService = {
  // Debug function to get all invoices (for troubleshooting)
  getAllInvoicesDebug: async () => {
    try {
      const snapshot = await firestore()
        .collection(INVOICES_COLLECTION)
        .get();

      console.log('DEBUG - All invoices in Firestore:', snapshot.size);
      const allInvoices = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log('DEBUG - All invoice data:', allInvoices);
      
      return { success: true, data: allInvoices };
    } catch (error) {
      console.error('DEBUG - Error fetching all invoices:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to fetch all invoices' 
      };
    }
  },
  // Save invoice to Firestore
  saveInvoice: async (invoiceData) => {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const invoiceWithMetadata = {
        ...invoiceData,
        userId: currentUser.uid,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      const docRef = await firestore()
        .collection(INVOICES_COLLECTION)
        .add(invoiceWithMetadata);

      return { 
        success: true, 
        id: docRef.id,
        data: { ...invoiceWithMetadata, id: docRef.id }
      };
    } catch (error) {
      console.error('Error saving invoice:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to save invoice' 
      };
    }
  },

  // Update existing invoice
  updateInvoice: async (invoiceId, invoiceData) => {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const invoiceWithMetadata = {
        ...invoiceData,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      await firestore()
        .collection(INVOICES_COLLECTION)
        .doc(invoiceId)
        .update(invoiceWithMetadata);

      return { 
        success: true, 
        data: { ...invoiceData, id: invoiceId }
      };
    } catch (error) {
      console.error('Error updating invoice:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to update invoice' 
      };
    }
  },

  // Get all invoices for current user
  getInvoices: async () => {
    try {
      const currentUser = auth().currentUser;
      console.log('getInvoices - current user:', currentUser?.uid, 'currentUser:', currentUser);
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const snapshot = await firestore()
        .collection(INVOICES_COLLECTION)
        .where('userId', '==', currentUser.uid)
        .get();

      console.log('Firestore query - snapshot size:', snapshot.size);
      const invoices = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()?.toISOString() || new Date().toISOString(),
        updatedAt: doc.data().updatedAt?.toDate()?.toISOString() || new Date().toISOString(),
      }));

      console.log('Processed invoices:', invoices);

      return { success: true, data: invoices };
    } catch (error) {
      console.error('Error fetching invoices:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to fetch invoices' 
      };
    }
  },

  // Delete invoice
  deleteInvoice: async (invoiceId) => {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      await firestore()
        .collection(INVOICES_COLLECTION)
        .doc(invoiceId)
        .delete();

      return { success: true };
    } catch (error) {
      console.error('Error deleting invoice:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to delete invoice' 
      };
    }
  },

  // Get single invoice by ID
  getInvoiceById: async (invoiceId) => {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const doc = await firestore()
        .collection(INVOICES_COLLECTION)
        .doc(invoiceId)
        .get();

      if (!doc.exists) {
        throw new Error('Invoice not found');
      }

      const invoiceData = doc.data();
      
      // Verify the invoice belongs to current user
      if (invoiceData.userId !== currentUser.uid) {
        throw new Error('Access denied');
      }

      return {
        success: true,
        data: {
          id: doc.id,
          ...invoiceData,
          createdAt: invoiceData.createdAt?.toDate()?.toISOString() || new Date().toISOString(),
          updatedAt: invoiceData.updatedAt?.toDate()?.toISOString() || new Date().toISOString(),
        }
      };
    } catch (error) {
      console.error('Error fetching invoice:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch invoice'
      };
    }
  },

  // Real-time listener for invoices
  onInvoicesChange: (callback) => {
    const currentUser = auth().currentUser;
    console.log('onInvoicesChange - current user:', currentUser?.uid, 'currentUser:', currentUser);
    if (!currentUser) {
      console.error('No authenticated user for invoice listener');
      callback({ success: false, error: 'User not authenticated' });
      return null;
    }

    const unsubscribe = firestore()
      .collection(INVOICES_COLLECTION)
      .where('userId', '==', currentUser.uid)
      .onSnapshot(
        (snapshot) => {
          console.log('Real-time listener - snapshot size:', snapshot.size);
          const invoices = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate()?.toISOString() || new Date().toISOString(),
            updatedAt: doc.data().updatedAt?.toDate()?.toISOString() || new Date().toISOString(),
          }));
          
          console.log('Real-time listener - processed invoices:', invoices);
          callback({ success: true, data: invoices });
        },
        (error) => {
          console.error('Error in invoices listener:', error);
          callback({ success: false, error: error.message || 'Failed to listen for invoices' });
        }
      );

    return unsubscribe;
  },
};
