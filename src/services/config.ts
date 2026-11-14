// src/services/config.ts
export const COLLAR_IP = '10.24.39.106';
export const COLLAR_BASE_URL = `http://${COLLAR_IP}`;
export const REQUEST_TIMEOUT_MS = 5000;

export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = REQUEST_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}