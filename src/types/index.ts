// src/types/index.ts

export type ThemeName = 'rosa' | 'escuro' | 'claro' | 'roxo' | 'azul';

export type PetProfile = {
  name: string;
  photoUri: string | null;
  birthDate: string;
  sex: string;
  breed: string;
  weight: string;
  allergies: string;
  notes: string;
};

export type Vaccine = {
  id: string;
  name: string;
  appliedAt: string;
  nextDose?: string;
  notes?: string;
};

export type ReminderCategory =
  | 'Consulta veterinária'
  | 'Vacinação'
  | 'Passeio'
  | 'Comprar ração'
  | 'Comprar petiscos'
  | 'Banho e tosa'
  | 'Medicamentos'
  | 'Outro';

export type Reminder = {
  id: string;
  title: string;
  category: ReminderCategory;
  date: string;
  time: string;
  description: string;
  completed: boolean;
  notify: boolean;
  notificationId?: string;
};

export type VetContact = {
  name: string;
  clinic: string;
  phone: string;
  notes: string;
};

export type AppAlert = {
  id: string;
  type: string;
  date: string;
  description: string;
  read: boolean;
  source: 'simulado' | 'dispositivo';
};

export type DeviceStatus = {
  connected: boolean;
  batteryPercent: number | null;
  lastSeen: string | null;
};

/// src/types/index.ts — substitua o tipo ActivityReport existente por:

export type ActivityHour = {
  hora: number;        // 0–23
  movimento: number;   // minutos em movimento naquela hora
  parado: number;      // minutos parado naquela hora
};

export type ActivityReport = {
  horas: ActivityHour[];
  ultima_atualizacao: string; // preenchido pelo app ao buscar
};

// Adicione também o tipo de status da coleira (usado no Bloco B):
export type CollarStatus = {
  distancia: number;          // cm
  modoEspera: boolean;
  freq: number;               // Hz
  volume: number;             // 0–100
  limiarInatividade: number;  // minutos
};

export type AppData = {
  pet: PetProfile;
  vaccines: Vaccine[];
  reminders: Reminder[];
  vet: VetContact;
  theme: ThemeName;
  demoMode: boolean;
  alerts: AppAlert[];
  notificationsEnabled: boolean;
  selectedAlertSoundId: string;
  collarVolume: number;
};