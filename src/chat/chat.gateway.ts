import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server } from 'socket.io';
import { WsJwtGuard } from './guards/ws-jwt.guard';
import { JoinRoomHandler } from './join-room/join-room.handler';
import { SendMessageWsHandler } from './send-message-ws/send-message-ws.handler';
import { TypingHandler } from './typing/typing.handler';

@WebSocketGateway({
  namespace: 'chat',
  cors: { origin: '*' },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly joinRoomHandler: JoinRoomHandler,
    private readonly sendMessageWsHandler: SendMessageWsHandler,
    private readonly typingHandler: TypingHandler,
  ) {}

  async handleConnection(client: { handshake: { auth?: { token?: string }; headers?: { authorization?: string } }; data: { userId?: string }; join: (room: string) => void }) {
    // Auth is validated in @UseGuards(WsJwtGuard) on each message; for connection we could validate here or leave to first message
    // Optionally validate JWT on connection and set client.data.userId; for simplicity we validate per-message
  }

  handleDisconnect() {
    // Optional: track online users
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('join_room')
  async handleJoinRoom(
    client: { data: { userId: string }; join: (room: string) => void },
    payload: { roomId: string },
  ) {
    const userId = (client.data as { userId: string }).userId;
    if (!userId) return;
    await this.joinRoomHandler.execute(payload.roomId, userId);
    client.join(payload.roomId);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('send_message')
  async handleSendMessage(
    client: { data: { userId: string } },
    payload: { roomId: string; content: string },
  ) {
    const userId = (client.data as { userId: string }).userId;
    if (!userId) return;
    const messagePayload = await this.sendMessageWsHandler.execute(
      payload.roomId,
      userId,
      payload.content,
    );
    this.server.to(payload.roomId).emit('message', messagePayload);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('typing')
  handleTyping(
    client: { data: { userId: string } },
    payload: { roomId: string },
  ) {
    const userId = (client.data as { userId: string }).userId;
    if (!userId) return;
    const typingPayload = this.typingHandler.execute(payload.roomId, userId);
    this.server.to(payload.roomId).emit('user_typing', typingPayload);
  }

  /** Call this from REST when a message is sent so real-time clients get it */
  emitMessage(roomId: string, messagePayload: unknown) {
    this.server.to(roomId).emit('message', messagePayload);
  }
}
