import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, ViewStyle, TextStyle } from 'react-native';
import { useApp } from '../context/AppContext';
import { themes } from '../constants/themes';

export function useColors() { 
  const { data } = useApp(); 
  return themes[data.theme]; 
}

export function Screen({ children, scroll = true }: { children: React.ReactNode; scroll?: boolean }) {
  const c = useColors();
  return scroll ? (
    <ScrollView style={{ flex: 1, backgroundColor: c.background }} contentContainerStyle={styles.screen} keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.screen, { flex: 1, backgroundColor: c.background }]}>{children}</View>
  );
}

export function Heading({ title, subtitle }: { title: string; subtitle?: string }) {
  const c = useColors();
  return (
    <View style={{ marginBottom: 4, gap: 5 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <View style={{ width: 7, height: 28, borderRadius: 8, backgroundColor: c.primary }} />
        <Text style={[styles.heading, { color: c.text, flexShrink: 1 }]}>{title}</Text>
      </View>
      {subtitle ? <Text style={{ color: c.muted, marginLeft: 15, marginTop: 1, lineHeight: 19 }}>{subtitle}</Text> : null}
    </View>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  const c = useColors();
  return (
    <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.border, shadowColor: c.primary }, style]}>
      {children}
    </View>
  );
}

export function AppButton({ title, onPress, secondary = false, danger = false }: { title: string; onPress: () => void; secondary?: boolean; danger?: boolean }) {
  const c = useColors();
  return (
    <Pressable 
      onPress={onPress} 
      style={({ pressed }) => [
        styles.button, 
        { 
          backgroundColor: danger ? c.danger : secondary ? c.surfaceAlt : c.primary, 
          borderColor: secondary ? c.border : c.primary, 
          opacity: pressed ? 0.86 : 1, 
          transform: [{ scale: pressed ? 0.985 : 1 }] 
        }
      ]}
    >
      <Text style={{ color: secondary ? c.text : c.primaryText, fontWeight: '700', textAlign: 'center', flexShrink: 1 }}>
        {title}
      </Text>
    </Pressable>
  );
}

export function Field({ label, value, onChangeText, placeholder, multiline = false, keyboardType }: { label: string; value: string; onChangeText: (v: string) => void; placeholder?: string; multiline?: boolean; keyboardType?: 'default' | 'numeric' | 'phone-pad' }) {
  const c = useColors();
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ color: c.text, fontWeight: '600', marginBottom: 6 }}>{label}</Text>
      <TextInput 
        value={value} 
        onChangeText={onChangeText} 
        placeholder={placeholder} 
        placeholderTextColor={c.muted} 
        keyboardType={keyboardType || 'default'} 
        multiline={multiline} 
        style={[styles.input, { color: c.text, backgroundColor: c.surface, borderColor: c.border }, multiline && { minHeight: 82, textAlignVertical: 'top' }]} 
      />
    </View>
  );
}

export function Pill({ label, color }: { label: string; color?: string }) {
  const c = useColors();
  return (
    <View style={{ alignSelf: 'flex-start', backgroundColor: color || c.surfaceAlt, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 }}>
      <Text style={{ color: c.text, fontSize: 12, fontWeight: '600' }}>{label}</Text>
    </View>
  );
}

export function Row({ children, style }: { children: React.ReactNode; style?: ViewStyle }) { 
  return <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 10 }, style]}>{children}</View>; 
}

export function Muted({ children, style }: { children: React.ReactNode; style?: TextStyle }) { 
  const c = useColors(); 
  return <Text style={[{ color: c.muted, fontSize: 13, flexShrink: 1 }, style]}>{children}</Text>; 
}

const styles = StyleSheet.create({
  screen: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 34, gap: 16 },
  heading: { fontSize: 25, fontWeight: '900', letterSpacing: -0.7 },
  card: { borderWidth: 1, borderRadius: 24, padding: 17, gap: 13, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.09, shadowRadius: 13, elevation: 3 },
  button: { borderRadius: 18, paddingVertical: 14, paddingHorizontal: 16, borderWidth: 1, minHeight: 48, justifyContent: 'center', alignItems: 'center' },
  input: { borderWidth: 1, borderRadius: 16, paddingHorizontal: 15, paddingVertical: 13, fontSize: 15 }
});
