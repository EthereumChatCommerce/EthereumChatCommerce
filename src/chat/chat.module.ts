import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { Message, MessageSchema } from './schemas/message.schema';
import { Room, RoomSchema } from './schemas/room.schema';
import { ChatRepository } from './repository/chat.repository';
import { ListRoomsController } from './list-rooms/list-rooms.controller';
import { ListRoomsService } from './list-rooms/list-rooms.service';
import { CreateRoomController } from './create-room/create-room.controller';
import { CreateRoomService } from './create-room/create-room.service';
import { GetMessagesController } from './get-messages/get-messages.controller';
import { GetMessagesService } from './get-messages/get-messages.service';
import { SendMessageController } from './send-message/send-message.controller';
import { SendMessageService } from './send-message/send-message.service';
import { JoinRoomHandler } from './join-room/join-room.handler';
import { SendMessageWsHandler } from './send-message-ws/send-message-ws.handler';
import { TypingHandler } from './typing/typing.handler';
import { ChatGateway } from './chat.gateway';
import { WsJwtGuard } from './guards/ws-jwt.guard';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Room.name, schema: RoomSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
  controllers: [
    ListRoomsController,
    CreateRoomController,
    GetMessagesController,
    SendMessageController,
  ],
  providers: [
    ChatRepository,
    ListRoomsService,
    CreateRoomService,
    GetMessagesService,
    SendMessageService,
    JoinRoomHandler,
    SendMessageWsHandler,
    TypingHandler,
    WsJwtGuard,
    ChatGateway,
  ],
  exports: [ChatGateway, SendMessageService],
})
export class ChatModule {}
