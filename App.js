/**
 * AmolFirstAIApp - React Native App
 * @format
 */

import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { colors } from './src/theme';
import AppNavigator from './src/navigation/AppNavigator';

function App() {
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
