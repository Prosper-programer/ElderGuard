import { io, Socket } from 'socket.io-client';
import { getApiBaseUrl } from '../constants/api';

let socket: Socket | null = null;

export interface AccountStatusChangeEvent {
  userId: number | string;
  status: 'active' | 'inactive';
  message?: string;
  email?: string;
}

type StatusChangeCallback = (event: AccountStatusChangeEvent) => void;
let statusChangeCallbacks: StatusChangeCallback[] = [];

/**
 * Connects the mobile app to the GUYNOVA GUARD WebSocket server
 * and joins the user's personal channel for instant push updates.
 */
export function connectSocket(userId: string | number): Socket {
  const serverUrl = getApiBaseUrl();

  if (socket && socket.connected) {
    socket.emit('join_user', userId);
    return socket;
  }

  socket = io(serverUrl, {
    transports: ['websocket', 'polling'],
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => {
    console.log(`🔌 Mobile WebSocket connected: ${socket?.id}`);
    if (userId) {
      socket?.emit('join_user', userId);
    }
  });

  socket.on('account_status_changed', (data: AccountStatusChangeEvent) => {
    console.log('⚡ Real-time account_status_changed received:', data);
    statusChangeCallbacks.forEach((cb) => cb(data));
  });

  socket.on('disconnect', (reason) => {
    console.log('🔌 Mobile WebSocket disconnected:', reason);
  });

  return socket;
}

/**
 * Subscribes a callback to real-time account status changes (e.g. deactivation / activation).
 */
export function onAccountStatusChange(callback: StatusChangeCallback): () => void {
  statusChangeCallbacks.push(callback);
  return () => {
    statusChangeCallbacks = statusChangeCallbacks.filter((cb) => cb !== callback);
  };
}

/**
 * Disconnects the socket when the user signs out.
 */
export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket(): Socket | null {
  return socket;
}

