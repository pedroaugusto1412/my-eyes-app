import { DeviceStatus } from '../types';

/**
 * Contrato de integração com a coleira.
 * Implementação real depende do protocolo BLE/GATT definido no firmware.
 * Não inventa UUIDs, mensagens ou leituras de sensores.
 */
export type DeviceEvent =
  | { type: 'obstacle'; detected: boolean; distanceCm?: number; timestamp: string }
  | { type: 'motion'; state: 'walking' | 'still' | 'intense'; timestamp: string }
  | { type: 'battery'; percent: number; timestamp: string };

export interface CollarDeviceService {
  scan(): Promise<void>;
  connect(deviceId: string): Promise<void>;
  disconnect(): Promise<void>;
  getStatus(): DeviceStatus;
  subscribe(listener: (event: DeviceEvent) => void): () => void;
  sendAudioCommand(command: string): Promise<void>;
}

export class DemoDeviceService implements CollarDeviceService {
  private listeners = new Set<(event: DeviceEvent) => void>();
  async scan() { /* A demonstração não procura hardware real. */ }
  async connect(_deviceId: string) { throw new Error('Conexão real indisponível: defina o protocolo BLE no firmware e integre um módulo nativo.'); }
  async disconnect() {}
  getStatus(): DeviceStatus { return { connected: false, batteryPercent: null, lastSeen: null }; }
  subscribe(listener: (event: DeviceEvent) => void) { this.listeners.add(listener); return () => this.listeners.delete(listener); }
  async sendAudioCommand(_command: string) { throw new Error('Envio de áudio para a coleira depende de conexão real e protocolo definido.'); }
}
export const deviceService: CollarDeviceService = new DemoDeviceService();
