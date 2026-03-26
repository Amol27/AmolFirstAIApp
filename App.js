/**
 * AmolFirstAIApp - React Native App
 * @format
 */

import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { colors } from './src/theme';
import AppNavigator from './src/navigation/AppNavigator';
import { onAuthStateChanged } from './src/services/firebaseAuth';
import { loginSuccess, logout } from './src/store/slices/authSlice';

function App() {
  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, update Redux state
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          emailVerified: user.emailVerified,
          name: user.displayName || user.email?.split('@')[0] || 'User',
        };
        store.dispatch(loginSuccess(userData));
      } else {
        // User is signed out, clear Redux state
        store.dispatch(logout());
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar 
          barStyle="light-content" 
          backgroundColor={colors.primary}
        />
        <View style={styles.container}>
          <AppNavigator />
        </View>
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
