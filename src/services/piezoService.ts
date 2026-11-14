// src/services/piezoService.ts
import { setPiezo } from './collarService';

// Mantém a assinatura antiga para não quebrar o audio.tsx,
// mas agora envia freq + volume juntos.
export async function alterarFrequencia(frequencia: number, volume = 50) {
  await setPiezo(frequencia, volume);
}