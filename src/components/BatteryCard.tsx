import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Muted, useColors, Row } from './UI';
export default function BatteryCard({ percent }: { percent: number | null }) {
  const c = useColors();
  return <Card style={{ borderRadius: 22 }}><Row><Ionicons name="battery-charging-outline" size={23} color={c.primary} /><Text style={{ color: c.text, fontWeight: '800', flex: 1 }}>Bateria da coleira</Text></Row>{percent === null ? <View style={{ backgroundColor: c.surfaceAlt, borderRadius: 15, padding: 12 }}><Row><Ionicons name="time-outline" size={17} color={c.muted} /><Muted>Aguardando conexão — nível de bateria indisponível.</Muted></Row></View> : <><Text style={{ color: c.text, fontSize: 24, fontWeight: '900' }}>{percent}%</Text><View style={{ height: 11, backgroundColor: c.surfaceAlt, borderRadius: 10, overflow: 'hidden' }}><View style={{ width: `${Math.max(0, Math.min(100, percent))}%`, height: 11, backgroundColor: percent < 20 ? c.danger : c.success, borderRadius: 10 }} /></View></>}</Card>;
}
