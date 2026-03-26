import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import { signInWithEmailAndPassword } from '../services/firebaseAuth';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    dispatch(loginStart());
    
    try {
      const result = await signInWithEmailAndPassword(email, password);
      
      if (result.success && result.user) {
        const userData = {
          uid: result.user.uid || '',
          email: result.user.email || email,
          displayName: result.user.displayName || '',
          emailVerified: result.user.emailVerified || false,
        };
        
        dispatch(loginSuccess(userData));
        Alert.alert('Success', 'Login successful!');
      } else {
        dispatch(loginFailure(result.error || 'Login failed'));
        Alert.alert('Error', result.error || 'Login failed');
      }
    } catch (err) {
      dispatch(loginFailure(err.message || 'Login failed'));
      Alert.alert('Error', 'Login failed. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Geometric Background Design */}
        <View style={styles.backgroundDesign}>
          <View style={[styles.geometricShape, styles.shape1]} />
          <View style={[styles.geometricShape, styles.shape2]} />
          <View style={[styles.geometricShape, styles.shape3]} />
          <View style={[styles.geometricShape, styles.shape4]} />
        </View>

        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>My Account</Text>
          <View style={styles.iconContainer}>
            <View style={styles.userIcon}>
              <Text style={styles.userIconText}>👤</Text>
            </View>
          </View>
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>👤</Text>
              <TextInput
                style={styles.input}
                placeholder="Login"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPasswordText}>Forgot password ?</Text>
          </TouchableOpacity>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Sign in</Text>
            )}
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  // Geometric Background Design
  backgroundDesign: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  geometricShape: {
    position: 'absolute',
    borderRadius: 150,
  },
  shape1: {
    width: 200,
    height: 200,
    backgroundColor: '#4A90E2',
    top: -50,
    right: -50,
    opacity: 0.3,
  },
  shape2: {
    width: 150,
    height: 150,
    backgroundColor: '#50C878',
    top: 100,
    left: -30,
    opacity: 0.25,
  },
  shape3: {
    width: 180,
    height: 180,
    backgroundColor: '#FF8C42',
    bottom: 200,
    right: 50,
    opacity: 0.2,
  },
  shape4: {
    width: 120,
    height: 120,
    backgroundColor: '#6B5B95',
    bottom: 50,
    left: 50,
    opacity: 0.15,
  },
  // Header Section
  headerSection: {
    paddingTop: spacing.xl * 2,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    zIndex: 1,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    fontWeight: 'bold',
    fontSize: 28,
  },
  iconContainer: {
    marginBottom: spacing.lg,
  },
  userIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(218, 165, 32, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  userIconText: {
    fontSize: 40,
  },
  // Form Section
  formContainer: {
    backgroundColor: colors.white,
    margin: spacing.lg,
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    ...shadows.card,
    zIndex: 1,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  inputIcon: {
    fontSize: 20,
    marginRight: spacing.md,
    color: colors.primary,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.textPrimary,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
  },
  forgotPasswordText: {
    ...typography.caption,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  errorIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  errorText: {
    ...typography.caption,
    color: '#E74C3C',
    flex: 1,
  },
  loginButton: {
    backgroundColor: '#FF8C42',
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    ...shadows.cardLight,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    ...typography.body,
    color: colors.textWhite,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default LoginScreen;
