import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppData } from '../types';

const KEY = '@my-eyes/app-data';
export async function loadData(): Promise<Partial<AppData> | null> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as Partial<AppData>; } catch { return null; }
}
export async function saveData(data: AppData): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(data));
}
