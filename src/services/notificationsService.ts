// src/services/notificationsService.ts
import * as Notifications from 'expo-notifications';
import { AppAlert } from '../types';

// Handler para quando uma notificação LOCAL chegar (ex: lembrete)
export function setupNotificationListener(onReceive: (data: any) => void) {
  const sub = Notifications.addNotificationReceivedListener((n) => {
    onReceive(n.request.content.data);
  });
  return () => sub.remove();
}

export function buildInactivityAlert(payload: any): AppAlert | null {
  if (!payload || payload.type !== 'inatividade') return null;
  const minutos = payload.minutos ?? 0;
  return {
    id: `inat-${Date.now()}`,
    type: 'Inatividade detectada',
    date: new Date().toISOString(),
    description: `O pet ficou ${minutos} minutos sem se mover. Considere verificar se está tudo bem.`,
    read: false,
    source: 'dispositivo',
  };
}   