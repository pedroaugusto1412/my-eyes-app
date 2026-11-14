// src/components/BottomNav.tsx
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { router, usePathname } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from './UI';

const tabs = [
  { path: '/', label: 'Início', icon: 'home-outline' as const },
  { path: '/audio', label: 'Áudio', icon: 'musical-notes-outline' as const },
  { path: '/activity', label: 'Atividade', icon: 'dog-side' as const },
  { path: '/collar', label: 'Coleira', icon: 'hardware-chip-outline' as const },
  { path: '/alerts', label: 'Alertas', icon: 'notifications-outline' as const },
];

export default function BottomNav() {
  const path = usePathname();
  const c = useColors();
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 8);

  return (
    <View
      style={{
        flexDirection: 'row',
        paddingTop: 9,
        paddingBottom: bottomInset,
        minHeight: 58 + bottomInset,
        borderTopWidth: 1,
        borderColor: c.border,
        backgroundColor: c.surface,
      }}
    >
      {tabs.map((t) => {
        const active = path === t.path || (t.path === '/' && path === '/index');
        return (
          <Pressable
            key={t.path}
            accessibilityRole="button"
            accessibilityLabel={t.label}
            hitSlop={4}
            onPress={() => router.replace(t.path as never)}
            style={{
              flex: 1,
              minHeight: 48,
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
            }}
          >
            {t.path === '/activity' ? (
              <MaterialCommunityIcons name="dog-side" size={24} color={active ? c.primary : c.muted} />
            ) : (
              <Ionicons
                name={t.icon as React.ComponentProps<typeof Ionicons>['name']}
                size={22}
                color={active ? c.primary : c.muted}
              />
            )}
            <Text
              style={{
                color: active ? c.primary : c.muted,
                fontSize: 11,
                fontWeight: active ? '800' : '500',
              }}
            >
              {t.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}