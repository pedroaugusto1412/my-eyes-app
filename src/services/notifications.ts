import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Reminder } from '../types';
import { reminderDateTime } from '../utils/date';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, shouldPlaySound: true, shouldSetBadge: false,
    shouldShowBanner: true, shouldShowList: true
  })
});

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('my-eyes-reminders', {
      name: 'Lembretes My Eyes', importance: Notifications.AndroidImportance.DEFAULT
    });
  }
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted;
}
export async function scheduleReminder(reminder: Reminder): Promise<string | undefined> {
  if (!reminder.notify) return undefined;
  const allowed = await requestNotificationPermission();
  if (!allowed) throw new Error('Permissão de notificações não concedida.');
  const date = reminderDateTime(reminder.date, reminder.time);
  if (date.getTime() <= Date.now()) throw new Error('Escolha uma data e horário futuros para a notificação.');
  return Notifications.scheduleNotificationAsync({
    content: { title: `Lembrete My Eyes: ${reminder.title}`, body: reminder.description || reminder.category, data: { reminderId: reminder.id } },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date }
  });
}
export async function cancelReminderNotification(id?: string): Promise<void> {
  if (id) await Notifications.cancelScheduledNotificationAsync(id);
}
