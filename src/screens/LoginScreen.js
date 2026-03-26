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
      
      if (result.success) {
        const userData = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          emailVerified: result.user.emailVerified,
        };
        
        dispatch(loginSuccess(userData));
        Alert.alert('Success', 'Login successful!');
      } else {
        dispatch(loginFailure(result.error));
        Alert.alert('Error', result.error);
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
        {/* Beautiful Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.welcomeCard}>
            <View style={styles.iconContainer}>
              <View style={styles.userIcon}>
                <Text style={styles.userIconText}>👤</Text>
              </View>
              <View style={styles.statusDot} />
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your account to continue</Text>
          </View>
        </View>

        {/* Beautiful Login Form */}
        <View style={styles.formContainer}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>Login</Text>
            <Text style={styles.formSubtitle}>Enter your credentials</Text>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>📧</Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
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
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#fff" />
                <Text style={[styles.loginButtonText, styles.loadingText]}>Signing in...</Text>
              </View>
            ) : (
              <View style={styles.buttonContent}>
                <Text style={styles.loginButtonText}>Sign In</Text>
                <Text style={styles.buttonArrow}>→</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Vishal Surude Associates</Text>
            <Text style={styles.footerSubtext}>Invoice Management System</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  // Beautiful Header Section
  headerSection: {
    paddingTop: spacing.xl * 2,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  welcomeCard: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    ...shadows.card,
    alignItems: 'center',
  },
  iconContainer: {
    position: 'relative',
    marginBottom: spacing.lg,
  },
  userIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  userIconText: {
    fontSize: 50,
  },
  statusDot: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2ECC71',
    borderWidth: 3,
    borderColor: colors.primary,
  },
  title: {
    ...typography.h1,
    color: colors.textWhite,
    textAlign: 'center',
    marginBottom: spacing.sm,
    fontWeight: 'bold',
  },
  subtitle: {
    ...typography.body,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  // Beautiful Form Section
  formContainer: {
    backgroundColor: colors.white,
    margin: spacing.lg,
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    ...shadows.card,
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  formTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    fontWeight: 'bold',
  },
  formSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
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
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    ...shadows.cardLight,
    marginBottom: spacing.lg,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    ...typography.body,
    color: colors.textWhite,
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonArrow: {
    fontSize: 20,
    color: colors.textWhite,
    marginLeft: spacing.sm,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: spacing.sm,
  },
  footer: {
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  footerSubtext: {
    ...typography.caption,
    color: colors.textSecondary,
    opacity: 0.7,
  },
});

export default LoginScreen;
