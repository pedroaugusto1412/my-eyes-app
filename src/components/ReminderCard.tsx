// src/components/ReminderCard.tsx
import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Reminder } from '../types';
import { Card, Muted, Row, useColors } from './UI';
import { formatDate } from '../utils/date';

export default function ReminderCard({
  reminder,
  onToggle,
  onEdit,
  onDelete,
}: {
  reminder: Reminder;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const c = useColors();
  return (
    <Card>
      <Row>
        <Ionicons name="calendar-outline" size={22} color={c.primary} />
        <View style={{ flex: 1 }}>
          <Text style={{ color: c.text, fontWeight: '700', textDecorationLine: reminder.completed ? 'line-through' : 'none' }}>
            {reminder.title}
          </Text>
          <Muted>{reminder.category} · {formatDate(reminder.date)} às {reminder.time}</Muted>
        </View>
      </Row>
      {reminder.description ? <Muted>{reminder.description}</Muted> : null}
      <Row>
        <View style={{ flex: 1 }}>
          <Text onPress={onToggle} style={{ color: c.primary, fontWeight: '700' }}>
            {reminder.completed ? 'Reabrir' : 'Marcar concluído'}
          </Text>
        </View>
        <Text onPress={onEdit} style={{ color: c.primary, fontWeight: '700' }}>Editar</Text>
        <Text onPress={onDelete} style={{ color: c.danger, fontWeight: '700' }}>Excluir</Text>
      </Row>
    </Card>
  );
}