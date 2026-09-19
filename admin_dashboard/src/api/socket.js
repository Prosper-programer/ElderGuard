import { io } from 'socket.io-client';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// Strip /api if present to get root socket server URL
const SOCKET_URL = API_BASE_URL.replace(/\/api\/?$/, '');

let socket = null;

export function getAdminSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('🔌 Admin Console connected to WebSocket:', socket.id);
      socket.emit('join_admin');
    });

    socket.on('disconnect', () => {
      console.log('🔌 Admin Console disconnected from WebSocket');
    });
  }

  return socket;
}
