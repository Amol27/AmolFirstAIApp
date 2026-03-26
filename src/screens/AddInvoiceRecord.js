import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { invoiceService } from '../services/firestoreService';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';

const AddInvoiceRecord = ({ navigation, route }) => {
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [mobile, setMobile] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [expenseType, setExpenseType] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingInvoiceId, setEditingInvoiceId] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Format date to DD/MM/YYYY
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const { invoice, isEditing: editing } = route.params || {};
    if (editing && invoice) {
      setIsEditing(true);
      setEditingInvoiceId(invoice.id);
      setCustomerName(invoice.customerName || '');
      setAddress(invoice.address || '');
      setDate(invoice.date || '');
      setMobile(invoice.mobile || '');
      setExpenses(invoice.expenses || '');
      
      // Parse existing date if available
      if (invoice.date) {
        const parts = invoice.date.split('/');
        if (parts.length === 3) {
          const parsedDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
          setSelectedDate(parsedDate);
        }
      }
    } else {
      // Set today's date as default for new invoices
      setDate(formatDate(new Date()));
      setSelectedDate(new Date());
    }
  }, [route.params]);

  const handleSubmit = async () => {
    // Validation
    if (!customerName.trim()) {
      Alert.alert('Error', 'Please enter customer name');
      return;
    }
    if (!address.trim()) {
      Alert.alert('Error', 'Please enter address');
      return;
    }
    if (!date.trim()) {
      Alert.alert('Error', 'Please select date');
      return;
    }
    if (!mobile.trim()) {
      Alert.alert('Error', 'Please enter mobile number');
      return;
    }

    // Mobile number validation (basic)
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile)) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);

    // Calculate total expenses
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Create invoice object
    const invoiceData = {
      customerName,
      address,
      date,
      mobile,
      expenses,
      totalExpenses,
    };

    try {
      let result;
      if (isEditing) {
        // Update existing invoice
        result = await invoiceService.updateInvoice(editingInvoiceId, invoiceData);
        if (result.success) {
          Alert.alert(
            'Success',
            'Invoice record updated successfully!',
            [
              {
                text: 'OK',
                onPress: () => {
                  navigation.navigate('Home', { refresh: true });
                },
              },
            ]
          );
        } else {
          throw new Error(result.error);
        }
      } else {
        // Add new invoice
        result = await invoiceService.saveInvoice(invoiceData);
        if (result.success) {
          Alert.alert(
            'Success',
            'Invoice record added successfully!',
            [
              {
                text: 'OK',
                onPress: () => {
                  navigation.navigate('Home', { refresh: true });
                },
              },
            ]
          );
        } else {
          throw new Error(result.error);
        }
      }

      // Clear form on success
      setCustomerName('');
      setAddress('');
      setDate('');
      setMobile('');
      setExpenses([]);
    } catch (error) {
      console.error('Error saving invoice:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to save invoice. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel',
      'Are you sure you want to cancel? Any unsaved data will be lost.',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleAddExpense = () => {
    setShowExpenseModal(true);
  };

  const handleSaveExpense = () => {
    if (!expenseType.trim()) {
      Alert.alert('Error', 'Please enter expense type');
      return;
    }
    if (!expenseAmount.trim()) {
      Alert.alert('Error', 'Please enter expense amount');
      return;
    }

    // Validate that amount is a valid number
    const numericAmount = parseFloat(expenseAmount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount greater than 0');
      return;
    }

    const newExpense = {
      id: Date.now().toString(),
      type: expenseType,
      amount: numericAmount,
      timestamp: new Date().toISOString(),
    };

    setExpenses([...expenses, newExpense]);
    setExpenseType('');
    setExpenseAmount('');
    setShowExpenseModal(false);
    
    Alert.alert('Success', 'Expense added successfully!');
  };

  const handleDeleteExpense = (expenseId) => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setExpenses(expenses.filter(expense => expense.id !== expenseId));
          },
        },
      ]
    );
  };

  const handleDatePress = () => {
    setShowDatePicker(true);
  };

  const handleDateChange = (event, selectedDateValue) => {
    setShowDatePicker(false);
    if (selectedDateValue) {
      setSelectedDate(selectedDateValue);
      setDate(formatDate(selectedDateValue));
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{isEditing ? 'Edit Invoice Record' : 'Add Invoice Record'}</Text>
            <Text style={styles.subtitle}>{isEditing ? 'Update the details below' : 'Fill in the details below'}</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Customer Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter customer name"
              value={customerName}
              onChangeText={setCustomerName}
              maxLength={50}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter complete address"
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={3}
              maxLength={200}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date *</Text>
            <TouchableOpacity style={styles.dateInput} onPress={handleDatePress}>
              <Text style={styles.dateInputText}>{date || 'Select date'}</Text>
              <Text style={styles.calendarIcon}>📅</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mobile Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter 10-digit mobile number"
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

          <View style={styles.expenseSection}>
            <TouchableOpacity style={styles.expenseLabel} onPress={handleAddExpense}>
              <Text style={styles.expenseLabelText}>+ Add Expense</Text>
            </TouchableOpacity>
          </View>

          {expenses.length > 0 && (
            <View style={styles.expenseList}>
              <Text style={styles.expenseListTitle}>Added Expenses</Text>
              {expenses.map((expense) => (
                <View key={expense.id} style={styles.expenseItem}>
                  <View style={styles.expenseDetails}>
                    <Text style={styles.expenseType}>{expense.type}</Text>
                    <Text style={styles.expenseAmount}>₹{expense.amount.toFixed(2)}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteExpense(expense.id)}
                  >
                    <Text style={styles.deleteButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
              
              <View style={styles.totalAmountContainer}>
                <Text style={styles.totalAmountLabel}>Total Amount:</Text>
                <Text style={styles.totalAmountValue}>
                  ₹{expenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
              disabled={isLoading}
            >
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <Text style={styles.buttonText}>{isEditing ? 'Updating...' : 'Submitting...'}</Text>
              ) : (
                <Text style={styles.buttonText}>{isEditing ? 'Update' : 'Submit'}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={showExpenseModal}
        onRequestClose={() => setShowExpenseModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Expense</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Expense Type *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Xerox, kharedi khat"
                value={expenseType}
                onChangeText={setExpenseType}
                maxLength={50}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Amount (₹) *</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                value={expenseAmount}
                onChangeText={(text) => {
                  // Allow only numbers and decimal point
                  const cleanedText = text.replace(/[^0-9.]/g, '');
                  // Ensure only one decimal point
                  const parts = cleanedText.split('.');
                  if (parts.length > 2) {
                    setExpenseAmount(parts[0] + '.' + parts[1]);
                  } else {
                    setExpenseAmount(cleanedText);
                  }
                }}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setShowExpenseModal(false)}
              >
                <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.submitButton]}
                onPress={handleSaveExpense}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 25,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    backgroundColor: '#fff',
  },
  dateInputText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  calendarIcon: {
    fontSize: 20,
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    gap: 15,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  submitButton: {
    backgroundColor: colors.primary,
    ...shadows.cardLight,
  },
  cancelButton: {
    backgroundColor: '#8E8E93',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  cancelButtonText: {
    color: '#fff',
  },
  expenseSection: {
    marginBottom: 20,
  },
  expenseLabel: {
    alignSelf: 'flex-start',
    marginBottom: 10,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  expenseLabelText: {
    ...typography.body,
    color: colors.textWhite,
    fontWeight: '600',
  },
  expenseList: {
    marginTop: 15,
    marginBottom: 20,
  },
  expenseListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  expenseDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expenseType: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  expenseAmount: {
    ...typography.body,
    color: colors.primary,
    fontWeight: 'bold',
  },
  deleteButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.cardLight,
  },
  totalAmountLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  totalAmountValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 25,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxHeight: '80%',
    width: '90%',
    justifyContent: 'flex-start',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 10,
    gap: 15,
  },
});

export default AddInvoiceRecord;
