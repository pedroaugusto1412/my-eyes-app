import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Row, useColors, Muted } from './UI';
export default function StatusCard({ title, value, icon, note }: { title: string; value: string; icon: React.ComponentProps<typeof Ionicons>['name']; note?: string }) {
  const c = useColors();
  return <Card style={{ borderRadius: 22, gap: 10 }}><Row><View style={{ width: 43, height: 43, borderRadius: 16, backgroundColor: c.surfaceAlt, alignItems: 'center', justifyContent: 'center' }}><Ionicons name={icon} size={23} color={c.primary} /></View><Text style={{ flex: 1, color: c.text, fontWeight: '800', fontSize: 15 }}>{title}</Text></Row><Text style={{ color: c.text, fontSize: 20, fontWeight: '900' }}>{value}</Text>{note ? <Muted style={{ lineHeight: 18 }}>{note}</Muted> : null}</Card>;
}
