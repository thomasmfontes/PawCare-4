import 'react-native-gesture-handler';
import React, { useEffect, useRef } from 'react';
import { LogBox } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';

import { AuthProvider } from './src/hooks/useAuth';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import Routes from './src/routes';

LogBox.ignoreLogs([
  'InteractionManager has been deprecated',
  '"shadow*" style props are deprecated',
  'props.pointerEvents is deprecated',
  'expo-notifications',
  'ExpoNotificationChannelManager',
  'shouldShowAlert',
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60, // 1 minuto
    },
  },
});

function AppContent() {
  const { isDark } = useTheme();
  const navigationRef = useRef<NavigationContainerRef<any>>(null);

  useEffect(() => {
    // Listener quando o usuário interage/toca na notificação do sistema
    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      if (data && data.screen && navigationRef.current) {
        navigationRef.current.navigate(data.screen as never);
      }
    });

    return () => {
      responseListener.remove();
    };
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Routes />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
