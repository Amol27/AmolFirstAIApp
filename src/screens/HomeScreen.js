import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  FlatList,
  Image,
  Linking,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { authAPI, userAPI } from '../services/api';
import { invoiceService } from '../services/firestoreService';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';
import Card from '../components/Card';

const HomeScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);
  const [invoices, setInvoices] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [profileData, setProfileData] = React.useState(null);
  const [loadingProfile, setLoadingProfile] = React.useState(false);

  // Helper functions
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getTotalAmount = () => {
    const total = invoices.reduce((sum, invoice) => sum + (invoice.totalExpenses || 0), 0);
    return `₹${total.toFixed(0)}`;
  };

  useEffect(() => {
    loadUserProfile();
    loadInvoices();
  }, []);

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadInvoices();
      return () => {};
    }, [])
  );

  // Check for refresh parameter from navigation
  useEffect(() => {
    if (route?.params?.refresh) {
      loadInvoices();
      // Reset the refresh parameter
      navigation.setParams({ refresh: false });
    }
  }, [route?.params?.refresh]);

  // Set up real-time listener for invoices
  useEffect(() => {
    const unsubscribe = invoiceService.onInvoicesChange((result) => {
      if (result.success) {
        setInvoices(result.data);
      } else {
        console.error('Error in invoice listener:', result.error);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      // Refresh both invoices and profile data when screen is focused
      loadInvoices();
      loadUserProfile();
    }, [])
  );

  const loadInvoices = async () => {
    setLoadingInvoices(true);
    try {
      const result = await invoiceService.getInvoices();
      if (result.success) {
        setInvoices(result.data);
      } else {
        console.error('Failed to load invoices:', result.error);
      }
    } catch (error) {
      console.error('Error loading invoices:', error);
    } finally {
      setLoadingInvoices(false);
    }
  };

  const loadUserProfile = async () => {
    setLoadingProfile(true);
    try {
      const response = await userAPI.getProfile();
      setProfileData(response.data);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              await authAPI.logout();
              dispatch(logout());
            } catch (error) {
              console.error('Logout error:', error);
              dispatch(logout());
            }
          },
        },
      ]
    );
  };

  const refreshProfile = () => {
    loadUserProfile();
  };

  const handleAddPress = () => {
    navigation.navigate('AddInvoiceRecord');
  };

  const handleShareInvoice = async (invoice) => {
    try {
      const invoiceMessage = `
🧾 *INVOICE DETAILS*

👤 *Customer:* ${invoice.customerName}
📞 *Mobile:* ${invoice.mobile}
📍 *Address:* ${invoice.address}
📅 *Date:* ${invoice.date}

💰 *Expenses Summary:*
${invoice.expenses?.map(expense => 
  `• ${expense.description}: ₹${expense.amount}`
).join('\n') || 'No expenses'}

💳 *Total Amount:* ₹${invoice.totalExpenses?.toFixed(2) || '0.00'}

---
Generated from Vishal Surude Associates
      `;

      const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(invoiceMessage)}`;
      
      // Check if WhatsApp is installed
      const canOpen = await Linking.canOpenURL(whatsappUrl);
      
      if (canOpen) {
        await Linking.openURL(whatsappUrl);
      } else {
        Alert.alert(
          'WhatsApp Not Found',
          'WhatsApp is not installed on your device. Please install WhatsApp to share invoices.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error sharing invoice:', error);
      Alert.alert(
        'Share Failed',
        'Failed to share invoice. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleDeleteInvoice = (invoiceId) => {
    Alert.alert(
      'Delete Invoice',
      'Are you sure you want to delete this invoice?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await invoiceService.deleteInvoice(invoiceId);
              if (!result.success) {
                throw new Error(result.error);
              }
              // Invoice will be automatically removed by the real-time listener
            } catch (error) {
              console.error('Error deleting invoice:', error);
              Alert.alert(
                'Error',
                'Failed to delete invoice. Please try again.',
                [{ text: 'OK' }]
              );
            }
          },
        },
      ]
    );
  };

  const renderInvoiceItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.invoiceItem}
      onPress={() => navigation.navigate('AddInvoiceRecord', { invoice: item, isEditing: true })}
    >
      <View style={styles.invoiceHeader}>
        <Text style={styles.customerName}>{item.customerName}</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={(e) => {
              e.stopPropagation();
              handleShareInvoice(item);
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.shareButtonText}>📤</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={(e) => {
              e.stopPropagation();
              handleDeleteInvoice(item.id);
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.deleteButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.invoiceDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date:</Text>
          <Text style={styles.detailValue}>{item.date}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Mobile:</Text>
          <Text style={styles.detailValue}>{item.mobile}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Address:</Text>
          <Text style={styles.detailValue} numberOfLines={1}>{item.address}</Text>
        </View>
        
        <View style={styles.expenseSummary}>
          <Text style={styles.expenseLabel}>Expenses ({item.expenses?.length || 0}):</Text>
          <Text style={styles.totalAmount}>₹{item.totalExpenses?.toFixed(2) || '0.00'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.container}>
        {/* Beautiful Welcome Header */}
        <View style={styles.welcomeHeader}>
          <View style={styles.welcomeContent}>
            <View style={styles.greetingSection}>
              <Text style={styles.greetingText}>Good {getTimeOfDay()},</Text>
              <Text style={styles.userName}>{user?.name || 'User'}</Text>
              <Text style={styles.welcomeSubtext}>Ready to manage your invoices today?</Text>
            </View>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{getInitials(user?.name || 'User')}</Text>
              </View>
              <View style={styles.statusDot} />
            </View>
          </View>
          
          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{invoices.length}</Text>
              <Text style={styles.statLabel}>Total Invoices</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{getTotalAmount()}</Text>
              <Text style={styles.statLabel}>Total Amount</Text>
            </View>
          </View>
        </View>

        {/* Invoice Records Card */}
        <Card style={styles.invoiceCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Today's Invoices</Text>
            <TouchableOpacity onPress={handleAddPress} style={styles.addButton}>
              <Text style={styles.addButtonText}>+ Add New</Text>
            </TouchableOpacity>
          </View>
          {loadingInvoices ? (
            <View style={styles.loadingState}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Loading invoices...</Text>
            </View>
          ) : invoices.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Text style={styles.emptyIconText}>📄</Text>
              </View>
              <Text style={styles.emptyStateText}>No invoices yet</Text>
              <Text style={styles.emptyStateSubtext}>Create your first invoice to get started</Text>
              <TouchableOpacity onPress={handleAddPress} style={styles.emptyActionButton}>
                <Text style={styles.emptyActionText}>Create Invoice</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={invoices}
              renderItem={renderInvoiceItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          )}
        </Card>

        {/* Commented out profile information code */}
        {/* <View style={styles.card}>
          <Text style={styles.cardTitle}>User Information</Text>
          <View style={styles.userInfo}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{user?.email || 'N/A'}</Text>
            
            <Text style={styles.infoLabel}>User ID:</Text>
            <Text style={styles.infoValue}>{user?.id || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Profile Data from API</Text>
            <TouchableOpacity onPress={refreshProfile} style={styles.refreshButton}>
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
          
          {loadingProfile ? (
            <ActivityIndicator size="small" color="#007AFF" />
          ) : profileData ? (
            <View style={styles.profileData}>
              <Text style={styles.infoLabel}>Name:</Text>
              <Text style={styles.infoValue}>{profileData.name}</Text>
              
              <Text style={styles.infoLabel}>Username:</Text>
              <Text style={styles.infoValue}>{profileData.username}</Text>
              
              <Text style={styles.infoLabel}>Website:</Text>
              <Text style={styles.infoValue}>{profileData.website}</Text>
            </View>
          ) : (
            <Text style={styles.noDataText}>No profile data available</Text>
          )}
        </View> */}

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard} onPress={handleAddPress}>
              <View style={styles.actionIcon}>
                <Text style={styles.actionIconText}>➕</Text>
              </View>
              <Text style={styles.actionTitle}>New Invoice</Text>
              <Text style={styles.actionSubtitle}>Create invoice</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('RecentInvoices')}>
              <View style={styles.actionIcon}>
                <Text style={styles.actionIconText}>�</Text>
              </View>
              <Text style={styles.actionTitle}>Recent Invoices</Text>
              <Text style={styles.actionSubtitle}>View all invoices</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  // Beautiful Welcome Header
  welcomeHeader: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  welcomeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  greetingSection: {
    flex: 1,
    marginRight: spacing.md,
  },
  greetingText: {
    ...typography.body,
    color: colors.textWhite,
    opacity: 0.9,
    marginBottom: spacing.xs,
  },
  userName: {
    ...typography.h2,
    color: colors.textWhite,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  welcomeSubtext: {
    ...typography.caption,
    color: colors.textWhite,
    opacity: 0.8,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textWhite,
  },
  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  // Stats Container
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    ...typography.h3,
    color: colors.textWhite,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textWhite,
    opacity: 0.8,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: spacing.md,
  },
  // Invoice Card
  invoiceCard: {
    margin: spacing.md,
    marginTop: -spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  addButtonText: {
    color: colors.textWhite,
    fontSize: 14,
    fontWeight: '600',
  },
  // Empty State
  loadingState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  emptyIconText: {
    fontSize: 40,
  },
  emptyStateText: {
    ...typography.body,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptyStateSubtext: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  emptyActionButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  emptyActionText: {
    color: colors.textWhite,
    fontSize: 16,
    fontWeight: '600',
  },
  // Quick Actions
  quickActionsContainer: {
    padding: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    marginHorizontal: spacing.xs,
    ...shadows.card,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  actionIconText: {
    fontSize: 24,
  },
  actionTitle: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  actionSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  // Invoice Item Styles
  invoiceItem: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.cardLight,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  customerName: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(231, 76, 60, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
    shadowColor: 'rgba(231, 76, 60, 0.2)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  shareButtonText: {
    fontSize: 16,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(231, 76, 60, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.md,
    shadowColor: 'rgba(231, 76, 60, 0.2)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  deleteButtonText: {
    fontSize: 16,
  },
  invoiceDetails: {
    gap: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '500',
    flex: 1,
  },
  detailValue: {
    ...typography.caption,
    color: colors.textPrimary,
    flex: 2,
    textAlign: 'right',
  },
  expenseSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.sm,
  },
  expenseLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  totalAmount: {
    ...typography.body,
    color: colors.primary,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
