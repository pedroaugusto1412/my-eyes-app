export type SoundItem = {
  id: string;
  title: string;
  description: string;
  frequency: string;
  duration: string;
  available: boolean;
};

export const PRESET_ALERT_SOUNDS: SoundItem[] = [
  {
    id: 'alert-1',
    title: 'Bipe Suave de Obstáculo',
    description: 'Tom suave e confortável para avisar de obstáculos próximos.',
    frequency: '440 Hz (Tom Agradável)',
    duration: '0.5s',
    available: true,
  },
  {
    id: 'alert-2',
    title: 'Aviso de Aproximação',
    description: 'Sinal duplo com cadência calma para indicar redução de ritmo.',
    frequency: '523 Hz (Nota Dó)',
    duration: '0.8s',
    available: true,
  },
  {
    id: 'alert-3',
    title: 'Comando de Parada Segura',
    description: 'Pulso contínuo aveludado para pausas e desvios.',
    frequency: '350 Hz (Frequência Grave)',
    duration: '0.6s',
    available: true,
  },
];

export const MAX_SAFE_COLLAR_VOLUME = 60;

export function sanitizeCollarVolume(requestedVolume: number): number {
  if (isNaN(requestedVolume) || requestedVolume < 0) return 0;
  return Math.min(requestedVolume, MAX_SAFE_COLLAR_VOLUME);
}