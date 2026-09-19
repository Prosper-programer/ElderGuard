import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';

let io: SocketIOServer | null = null;

export function initSocket(server: HTTPServer): SocketIOServer {
  io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`🔌 WebSocket connected: ${socket.id}`);

    // Allow mobile users to join their personal notification channel
    socket.on('join_user', (userId: string | number) => {
      if (userId) {
        const room = `user_${userId}`;
        socket.join(room);
        console.log(`📱 User joined real-time channel: ${room} (socket: ${socket.id})`);
      }
    });

    // Allow Admin consoles to join the administrative channel
    socket.on('join_admin', () => {
      socket.join('admin_room');
      console.log(`💻 Admin joined real-time admin channel (socket: ${socket.id})`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 WebSocket disconnected: ${socket.id}`);
    });
  });

  return io;
}

export function getSocketIO(): SocketIOServer | null {
  return io;
}
