import { useState, useCallback } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useRouter } from 'expo-router';

export const useAppLayout = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const router = useRouter();

  const handleNavigate = useCallback((route: string) => {
    router.replace(`./${route}`);
  }, [router]);

  const finishLoading = useCallback(async () => {
    setAppIsReady(true);
    await SplashScreen.hideAsync();
  }, []);

  return {
    appIsReady,
    handleNavigate,
    finishLoading,
  };
}; 