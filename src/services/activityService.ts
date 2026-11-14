// src/services/activityService.ts
import { ActivityReport } from '../types';
import { COLLAR_BASE_URL, fetchWithTimeout } from './config';

export async function fetchActivityReport(): Promise<ActivityReport> {
  const res = await fetchWithTimeout(`${COLLAR_BASE_URL}/relatorio`);
  if (!res.ok) throw new Error(`Erro na resposta: ${res.status}`);
  const data = await res.json();
  return {
    horas: Array.isArray(data.horas) ? data.horas : [],
    ultima_atualizacao: new Date().toISOString(),
  };
}