import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import { StatusBar } from "expo-status-bar";
import { Provider, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState, store } from '../store/store';
import { loadUser } from '~/slices/authSlice';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

SplashScreen.preventAutoHideAsync();

function AuthLoader({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [appIsReady, setAppIsReady] = useState(false);

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const loading = useSelector((state: RootState) => state.auth.loading);

  const prepare = useCallback(async () => {
    try {           
       await dispatch(loadUser()).unwrap();
    } catch (error) {
      console.warn('Error restoring session:', error);
    } finally {
      setAppIsReady(true);
    }
  }, [dispatch]);

  useEffect(() => {
    prepare();
  }, [prepare]);

  // Handle navigation and splash screen
  useEffect(() => {
    const handleInitialNavigation = async () => {
      if (appIsReady && !loading) {
        try {
          await SplashScreen.hideAsync();
          // Delay navigation slightly to ensure layout is ready
          if (isAuthenticated) {
            setTimeout(() => {
              router.replace('/(dashboard)');
            }, 100);
          }
        } catch (error) {
          console.warn('Navigation error:', error);
        }
      }
    };

    handleInitialNavigation();
  }, [appIsReady, loading, isAuthenticated, router]);

  if (!appIsReady || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return <>{children}</>;
}

export default function Layout() {
  return (
    <Provider store={store}>
      <AuthLoader>
        <StatusBar style='dark' />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#ffffff',
            },
            headerTintColor: '#000000',
          }}
        >
          <Stack.Screen 
            name="index" 
            options={{ 
              headerShown: false,
            }} 
          />
          <Stack.Screen 
            name="(dashboard)" 
            options={{ 
              headerShown: false,
            }} 
          />
          <Stack.Screen 
            name="+not-found" 
            options={{ 
              title: 'Not Found',
            }} 
          />
        </Stack>
      </AuthLoader>
    </Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

