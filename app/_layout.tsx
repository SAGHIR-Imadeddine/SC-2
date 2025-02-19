import * as SplashScreen from 'expo-splash-screen';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from "expo-status-bar";
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAppLayout } from '../hooks/useAppLayout';
import { useAuth } from '../hooks/useAuth';


function LayoutNav() {
  const { isAuthenticated, loading, initializeAuth } = useAuth();


  if ( loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
 
  return (
    <>
   <StatusBar style='dark' />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#ffffff',
            },
            headerTintColor: '#000000',
            gestureEnabled: false,
          }}
        >
          <Stack.Screen 
            name="index" 
            options={{ 
              headerShown: false,
            }} 
          />
          <Stack.Screen 
            name="dashboard" 
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
    </>
  )
}


SplashScreen.preventAutoHideAsync();

function AuthLoader({ children }: { children: React.ReactNode }) {
  const { appIsReady, handleNavigate, finishLoading } = useAppLayout();
  const { isAuthenticated, loading, initializeAuth } = useAuth();

  useEffect(() => {
    initializeAuth().then(finishLoading);
  }, []);

  useEffect(() => {
    if (appIsReady && !loading && isAuthenticated) {
      handleNavigate('/dashboard');
    }
  }, [isAuthenticated, appIsReady, loading]);

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
       <LayoutNav />
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

