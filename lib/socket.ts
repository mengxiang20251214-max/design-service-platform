import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

let io: SocketIOServer | null = null;

export function initializeSocket(httpServer: HTTPServer): SocketIOServer {
  if (io) {
    return io;
  }

  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join room for specific order
    socket.on('join-order', (orderId: string, userId: string) => {
      const roomName = `order-${orderId}`;
      socket.join(roomName);
      socket.data.userId = userId;
      socket.data.orderId = orderId;
      console.log(`User ${userId} joined room ${roomName}`);
    });

    // Send message event
    socket.on('send-message', (data: any) => {
      const roomName = `order-${data.orderId}`;
      io?.to(roomName).emit('receive-message', {
        id: data.id,
        fromUserId: data.fromUserId,
        fromUserName: data.fromUserName,
        message: data.message,
        createdAt: data.createdAt,
      });
      console.log(`Message sent in room ${roomName}`);
    });

    // Mark message as read
    socket.on('message-read', (data: any) => {
      const roomName = `order-${data.orderId}`;
      io?.to(roomName).emit('message-read', {
        messageId: data.messageId,
      });
    });

    // Leave order room
    socket.on('leave-order', (orderId: string) => {
      const roomName = `order-${orderId}`;
      socket.leave(roomName);
      console.log(`User ${socket.data.userId} left room ${roomName}`);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
}

export function getIO(): SocketIOServer | null {
  return io;
}
