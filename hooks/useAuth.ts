import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { login, loadUser, logout } from '../slices/authSlice';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const loading = useSelector((state: RootState) => state.auth.loading);
  const error = useSelector((state: RootState) => state.auth.error);
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogin = async (secret: string) => {
    if (secret.trim().length < 3) {
      Alert.alert('Invalid ID', 'Please enter a valid ID (minimum 3 characters).');
      return false;
    }

    try {
      await dispatch(login(secret)).unwrap();
    //   console.log(user);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const initializeAuth = async () => {
    try {
      await dispatch(loadUser()).unwrap();
    //   console.log(user);
      return true;
    } catch (error) {
      console.warn('Error restoring session:', error);
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      console.log(user);
      return true;
    
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    isAuthenticated,
    loading,
    error,
    user,
    handleLogin,
    initializeAuth,
    logout: handleLogout,
  };
}; 