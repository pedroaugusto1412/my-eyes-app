// src/services/collarService.ts
import { COLLAR_BASE_URL, fetchWithTimeout } from './config';
import { CollarStatus } from '../types';

async function post(path: string, params: Record<string, string | number | boolean>) {
  const query = Object.entries(params)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
  const res = await fetchWithTimeout(`${COLLAR_BASE_URL}${path}?${query}`, { method: 'POST' });
  if (!res.ok) throw new Error(`Erro ${res.status} em ${path}`);
  return res.text();
}

export async function getCollarStatus(): Promise<CollarStatus> {
  const res = await fetchWithTimeout(`${COLLAR_BASE_URL}/status`);
  if (!res.ok) throw new Error(`Erro ${res.status} em /status`);
  const data = await res.json();
  return {
    distancia: data.distancia ?? 50,
    modoEspera: !!data.modoEspera,
    freq: data.freq ?? 1000,
    volume: data.volume ?? 50,
    limiarInatividade: data.limiarInatividade ?? 30,
  };
}

export async function setDistancia(valor: number) {
  return post('/config/distancia', { valor });
}

export async function setModoEspera(ativo: boolean) {
  return post('/config/modo-espera', { valor: ativo ? 'true' : 'false' });
}

export async function setPiezo(freq: number, volume: number) {
  return post('/config/piezo', { freq, volume });
}

export async function setLimiarInatividade(valor: number) {
  return post('/config/limiar', { valor });
}