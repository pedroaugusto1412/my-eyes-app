// app/_layout.tsx
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AppProvider, useApp } from '../src/context/AppContext';
import BottomNav from '../src/components/BottomNav';
import { useColors } from '../src/components/UI';
import { setupNotificationListener, buildInactivityAlert } from '../src/services/notificationsService';

function Shell() {
  const c = useColors();
  const { addAlert } = useApp();

  useEffect(() => {
    // Listener para notificações locais (se houver)
    const unsubscribe = setupNotificationListener((payload) => {
      const alert = buildInactivityAlert(payload);
      if (alert) addAlert(alert);
    });
    return unsubscribe;
  }, [addAlert]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: c.background }}
      edges={['top', 'left', 'right']}
    >
      <View style={{ flex: 1, backgroundColor: c.background }}>
        <View style={{ flex: 1 }}>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'fade',
              contentStyle: { backgroundColor: c.background },
            }}
          />
        </View>
        <BottomNav />
      </View>
    </SafeAreaView>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <Shell />
      </AppProvider>
    </SafeAreaProvider>
  );
}