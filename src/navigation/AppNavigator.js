import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { logout } from '../store/slices/authSlice';
import { authAPI } from '../services/api';
import { colors, spacing, borderRadius } from '../theme';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import AddInvoiceRecord from '../screens/AddInvoiceRecord';

const Stack = createStackNavigator();

// Header Logout Button Component
const HeaderLogoutButton = () => {
  const dispatch = useDispatch();

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

  return (
    <TouchableOpacity style={headerStyles.logoutButton} onPress={handleLogout}>
      <Text style={headerStyles.logoutButtonText}>Logout</Text>
    </TouchableOpacity>
  );
};

const headerStyles = StyleSheet.create({
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
  },
  logoutButtonText: {
    color: colors.textWhite,
    fontSize: 14,
    fontWeight: '600',
  },
});

const AppNavigator = () => {
  const token = useSelector((state) => state.auth.token);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.textWhite,
          headerTitleStyle: {
            fontWeight: 'bold',
            color: colors.textWhite,
          },
        }}
      >
        {token ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                title: 'Home',
                headerRight: () => <HeaderLogoutButton />,
              }}
            />
            <Stack.Screen
              name="AddInvoiceRecord"
              component={AddInvoiceRecord}
              options={{
                title: 'Add Invoice Record',
                headerBackTitle: 'Back',
                headerRight: () => <HeaderLogoutButton />,
              }}
            />
          </>
        ) : (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              title: 'Login',
              headerShown: false,
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
