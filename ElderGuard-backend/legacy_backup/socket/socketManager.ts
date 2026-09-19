import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { config } from '../../src/config';

class SocketManager {
  private io: Server | null = null;

  public init(httpServer: HttpServer): Server {
    this.io = new Server(httpServer, {
      cors: {
        origin: config.corsOrigin,
        methods: ['GET', 'POST', 'PATCH'],
        credentials: true,
      },
      path: '/socket.io',
    });

    this.io.on('connection', (socket: Socket) => {
      console.log(`[WebSocket] Client connected: ${socket.id}`);

      // Client subscribes to real-time events for a specific senior
      socket.on('join:elderly', (elderlyId: string) => {
        if (elderlyId) {
          socket.join(`elderly:${elderlyId}`);
          console.log(`[WebSocket] ${socket.id} joined room: elderly:${elderlyId}`);
        }
      });

      socket.on('leave:elderly', (elderlyId: string) => {
        if (elderlyId) {
          socket.leave(`elderly:${elderlyId}`);
          console.log(`[WebSocket] ${socket.id} left room: elderly:${elderlyId}`);
        }
      });

      socket.on('disconnect', () => {
        console.log(`[WebSocket] Client disconnected: ${socket.id}`);
      });
    });

    return this.io;
  }

  public getIO(): Server {
    if (!this.io) {
      throw new Error('Socket.io has not been initialized yet.');
    }
    return this.io;
  }

  /**
   * Broadcast vital update to all clients monitoring the senior
   */
  public emitVitalUpdate(elderlyId: string, vitalsData: any) {
    if (!this.io) return;
    this.io.to(`elderly:${elderlyId}`).emit('vital:update', vitalsData);
    this.io.to(`elderly:${elderlyId}`).emit('vital:packet', vitalsData);
    // Also emit globally for dashboards tracking all seniors
    this.io.emit('vital:broadcast', { elderlyId, ...vitalsData });
  }

  /**
   * Broadcast critical alert incident to Parent & Caregiver apps
   */
  public emitAlertTriggered(elderlyId: string, alertData: any) {
    if (!this.io) return;
    console.log(`[WebSocket] High-priority alert triggered for elderly ${elderlyId}: ${alertData.title}`);
    this.io.to(`elderly:${elderlyId}`).emit('alert:triggered', alertData);
    this.io.emit('alert:broadcast', alertData);
  }

  /**
   * Broadcast alert status mutation (acknowledged or resolved)
   */
  public emitAlertUpdated(elderlyId: string, event: 'alert:acknowledged' | 'alert:resolved', alertData: any) {
    if (!this.io) return;
    this.io.to(`elderly:${elderlyId}`).emit(event, alertData);
    this.io.emit(event, alertData);
  }

  /**
   * Broadcast medication dose updates
   */
  public emitDoseUpdated(elderlyId: string, doseData: any) {
    if (!this.io) return;
    this.io.to(`elderly:${elderlyId}`).emit('care:dose_updated', doseData);
    this.io.emit('care:dose_updated', doseData);
  }
}

export const socketManager = new SocketManager();
