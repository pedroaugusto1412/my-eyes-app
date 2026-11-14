import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppAlert } from '../types';
import { Card, Muted, Row, useColors } from './UI';
export default function AlertCard({ alert, onRead, onDelete }: { alert: AppAlert; onRead: () => void; onDelete: () => void }) {
  const c = useColors();
  return <Card><Row><Ionicons name="notifications-outline" size={23} color={c.primary} /><View style={{ flex: 1 }}><Text style={{ color: c.text, fontWeight: '800' }}>{alert.type}</Text><Muted>{new Date(alert.date).toLocaleString('pt-BR')} · {alert.source === 'simulado' ? 'Demonstração' : 'Dispositivo'}</Muted></View>{!alert.read ? <Text style={{ color: c.primary }}>●</Text> : null}</Row><Text style={{ color: c.text }}>{alert.description}</Text><Row><View style={{ flex: 1 }}><Text onPress={onRead} style={{ color: c.primary, fontWeight: '700' }}>{alert.read ? 'Lido' : 'Marcar como lido'}</Text></View><Text onPress={onDelete} style={{ color: c.danger, fontWeight: '700' }}>Excluir</Text></Row></Card>;
}
