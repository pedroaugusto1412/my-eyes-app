// src/context/AppContext.tsx
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { AppAlert, AppData, PetProfile, Reminder, Vaccine, VetContact, ThemeName, ActivityReport } from '../types';
import { loadData, saveData } from '../services/storage';
import { cancelReminderNotification, scheduleReminder } from '../services/notifications';
import { MAX_SAFE_COLLAR_VOLUME, sanitizeCollarVolume } from '../services/audio';

const defaultPet: PetProfile = { name: 'Buddy', photoUri: null, birthDate: '', sex: '', breed: '', weight: '', allergies: '', notes: '' };
const defaultReport: ActivityReport = { horas: [], ultima_atualizacao: '' };

const initial: AppData = {
  pet: defaultPet,
  vaccines: [],
  reminders: [],
  vet: { name: '', clinic: '', phone: '', notes: '' },
  theme: 'rosa',
  demoMode: true,
  alerts: [
    { id: 'demo-1', type: 'Obstáculo detectado', date: new Date().toISOString(), description: 'Exemplo de alerta para visualização da interface.', read: false, source: 'simulado' }
  ],
  notificationsEnabled: true,
  selectedAlertSoundId: 'alert-1',
  collarVolume: 45,
};

type ContextValue = {
  data: AppData;
  ready: boolean;
  updatePet: (pet: PetProfile) => void;
  updateVet: (vet: VetContact) => void;
  setTheme: (theme: ThemeName) => void;
  setDemoMode: (enabled: boolean) => void;
  addVaccine: (v: Vaccine) => void;
  updateVaccine: (v: Vaccine) => void;
  deleteVaccine: (id: string) => void;
  addReminder: (r: Reminder) => Promise<void>;
  updateReminder: (r: Reminder) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
  toggleReminder: (id: string) => void;
  markAlertRead: (id: string) => void;
  deleteAlert: (id: string) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setSelectedAlertSound: (soundId: string) => void;
  setCollarVolume: (volume: number) => void;
  addAlert: (alert: AppAlert) => void;
  activityReport: ActivityReport;
  setActivityReport: (report: ActivityReport) => void;
};

const AppContext = createContext<ContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(initial);
  const [activityReport, setActivityReport] = useState<ActivityReport>(defaultReport);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadData().then(saved => {
      if (saved) {
        const safeVolume = sanitizeCollarVolume(saved.collarVolume ?? initial.collarVolume);
        setData({
          ...initial,
          ...saved,
          pet: { ...defaultPet, ...saved.pet },
          vet: { ...initial.vet, ...saved.vet },
          collarVolume: safeVolume,
        });
      }
    }).catch(() => Alert.alert('Armazenamento', 'Não foi possível carregar os dados salvos.')).finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (ready) saveData(data).catch(() => Alert.alert('Armazenamento', 'Não foi possível salvar as alterações.'));
  }, [data, ready]);

  const updatePet = useCallback((pet: PetProfile) => setData(d => ({ ...d, pet })), []);
  const updateVet = useCallback((vet: VetContact) => setData(d => ({ ...d, vet })), []);
  const setTheme = useCallback((theme: ThemeName) => setData(d => ({ ...d, theme })), []);
  const setDemoMode = useCallback((demoMode: boolean) => setData(d => ({ ...d, demoMode })), []);
  const addVaccine = useCallback((v: Vaccine) => setData(d => ({ ...d, vaccines: [v, ...d.vaccines] })), []);
  const updateVaccine = useCallback((v: Vaccine) => setData(d => ({ ...d, vaccines: d.vaccines.map(x => x.id === v.id ? v : x) })), []);
  const deleteVaccine = useCallback((id: string) => setData(d => ({ ...d, vaccines: d.vaccines.filter(x => x.id !== id) })), []);

  const addReminder = useCallback(async (r: Reminder) => {
    let notificationId: string | undefined;
    try { if (r.notify && data.notificationsEnabled) notificationId = await scheduleReminder(r); }
    catch (e) { Alert.alert('Notificação agendada', e instanceof Error ? e.message : 'Verifique as permissões.'); }
    setData(d => ({ ...d, reminders: [{ ...r, notificationId }, ...d.reminders] }));
  }, [data.notificationsEnabled]);

  const updateReminder = useCallback(async (r: Reminder) => {
    const old = data.reminders.find(x => x.id === r.id);
    await cancelReminderNotification(old?.notificationId);
    let notificationId: string | undefined;
    try { if (r.notify && data.notificationsEnabled && !r.completed) notificationId = await scheduleReminder(r); }
    catch (e) { Alert.alert('Notificação agendada', e instanceof Error ? e.message : 'Verifique as permissões.'); }
    setData(d => ({ ...d, reminders: d.reminders.map(x => x.id === r.id ? { ...r, notificationId } : x) }));
  }, [data.reminders, data.notificationsEnabled]);

  const deleteReminder = useCallback(async (id: string) => {
    const item = data.reminders.find(x => x.id === id);
    await cancelReminderNotification(item?.notificationId);
    setData(d => ({ ...d, reminders: d.reminders.filter(x => x.id !== id) }));
  }, [data.reminders]);

  const toggleReminder = useCallback((id: string) => setData(d => ({ ...d, reminders: d.reminders.map(r => r.id === id ? { ...r, completed: !r.completed } : r) })), []);
  const markAlertRead = useCallback((id: string) => setData(d => ({ ...d, alerts: d.alerts.map(a => a.id === id ? { ...a, read: true } : a) })), []);
  const deleteAlert = useCallback((id: string) => setData(d => ({ ...d, alerts: d.alerts.filter(a => a.id !== id) })), []);
  const addAlert = useCallback((alert: AppAlert) => setData(d => ({ ...d, alerts: [alert, ...d.alerts] })), []);
  const setNotificationsEnabled = useCallback((notificationsEnabled: boolean) => setData(d => ({ ...d, notificationsEnabled })), []);
  const setSelectedAlertSound = useCallback((selectedAlertSoundId: string) => setData(d => ({ ...d, selectedAlertSoundId })), []);

  const setCollarVolume = useCallback((requestedVol: number) => {
    const safeVol = sanitizeCollarVolume(requestedVol);
    if (requestedVol > MAX_SAFE_COLLAR_VOLUME) {
      Alert.alert(
        'Proteção Auditiva Ativa',
        `O volume foi ajustado para ${MAX_SAFE_COLLAR_VOLUME}%. Para proteger a audição do cão, o aplicativo não permite volumes superiores a este limite seguro.`
      );
    }
    setData(d => ({ ...d, collarVolume: safeVol }));
  }, []);

  const value = useMemo(() => ({
    data, ready, updatePet, updateVet, setTheme, setDemoMode,
    addVaccine, updateVaccine, deleteVaccine, addReminder, updateReminder, deleteReminder,
    toggleReminder, markAlertRead, deleteAlert, addAlert, setNotificationsEnabled,
    setSelectedAlertSound, setCollarVolume,
    activityReport, setActivityReport,
  }), [data, ready, updatePet, updateVet, setTheme, setDemoMode, addVaccine, updateVaccine, deleteVaccine, addReminder, updateReminder, deleteReminder, toggleReminder, markAlertRead, deleteAlert, addAlert, setNotificationsEnabled, setSelectedAlertSound, setCollarVolume, activityReport]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error('useApp deve ser usado dentro de AppProvider');
  return value;
}