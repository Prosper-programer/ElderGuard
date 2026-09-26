/**
 * FIRST AID SERVICE — Frontend
 *
 * Fetches first-aid protocols from the backend with a timeout.
 * Falls back to the local offline protocols if anything goes wrong.
 *
 * This service guarantees it always returns a valid protocol — it never
 * throws an error to the UI layer.
 */

import { API_BASE_URL } from '../constants/api';
import { FirstAidProtocol, getOfflineProtocol } from '../constants/firstAidProtocols';

const FETCH_TIMEOUT_MS = 4000; // 4 seconds — fast enough for an emergency

/**
 * Fetch a first-aid protocol from the backend.
 *
 * @param type - Emergency type: fall | cardiac | stroke | choking | breathing
 * @returns A protocol object. source will be 'offline' if local fallback was used.
 */
export async function fetchFirstAidProtocol(type: string): Promise<FirstAidProtocol> {
  const normalizedType = (type || 'fall').toLowerCase().trim();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    const response = await fetch(
      `${API_BASE_URL}/api/first-aid/protocols/${normalizedType}`,
      { signal: controller.signal }
    );

    clearTimeout(timeout);

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const json = await response.json();
    if (json.status === 'success' && json.data) {
      return json.data as FirstAidProtocol;
    }

    throw new Error('Invalid response structure');
  } catch {
    // Network unavailable, backend down, timeout, or any other error:
    // Silently fall back to the local protocol — never surface an error to the user.
    const offline = getOfflineProtocol(normalizedType);
    if (offline) return { ...offline, source: 'offline' };

    // Absolute last resort: return the fall protocol if the type is unrecognised
    return getOfflineProtocol('fall')!;
  }
}
