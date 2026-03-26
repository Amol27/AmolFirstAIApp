import auth from '@react-native-firebase/auth';

export const signInWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    let errorMessage = 'Login failed';
    
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address';
        break;
      case 'auth/user-disabled':
        errorMessage = 'Account has been disabled';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many failed attempts. Please try again later';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Network error. Please check your internet connection and Firebase configuration';
        break;
      default:
        errorMessage = error.message || 'Login failed';
    }
    
    return { success: false, error: errorMessage };
  }
};

export const createUserWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    let errorMessage = 'Registration failed';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'Email is already registered';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address';
        break;
      case 'auth/operation-not-allowed':
        errorMessage = 'Email/password accounts are not enabled';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password is too weak';
        break;
      default:
        errorMessage = error.message || 'Registration failed';
    }
    
    return { success: false, error: errorMessage };
  }
};

export const signOut = async () => {
  try {
    await auth().signOut();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || 'Sign out failed' };
  }
};

export const onAuthStateChanged = (callback) => {
  return auth().onAuthStateChanged(callback);
};

export const getCurrentUser = () => {
  return auth().currentUser;
};
