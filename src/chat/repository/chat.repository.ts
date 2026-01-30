import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message, MessageDocument } from '../schemas/message.schema';
import { Room, RoomDocument } from '../schemas/room.schema';

@Injectable()
export class ChatRepository {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async createRoom(participantIds: [string, string]): Promise<RoomDocument> {
    const sorted = [...participantIds].sort();
    const objectIds = sorted.map((id) => new Types.ObjectId(id));
    const existing = await this.roomModel.findOne({ participants: objectIds }).exec();
    if (existing) return existing;
    const [room] = await this.roomModel.create([{ participants: objectIds }]);
    return room;
  }

  async findRoomsForUser(userId: string): Promise<RoomDocument[]> {
    return this.roomModel
      .find({ participants: new Types.ObjectId(userId) })
      .populate('participants', 'email displayName')
      .sort({ updatedAt: -1 })
      .exec();
  }

  async findRoomById(roomId: string): Promise<RoomDocument | null> {
    return this.roomModel.findById(roomId).exec();
  }

  async isParticipant(roomId: string, userId: string): Promise<boolean> {
    const room = await this.roomModel
      .findById(roomId)
      .select('participants')
      .exec();
    if (!room) return false;
    const uid = new Types.ObjectId(userId);
    return room.participants.some((p) => p.equals(uid));
  }

  async createMessage(
    roomId: string,
    senderId: string,
    content: string,
  ): Promise<MessageDocument> {
    const message = await this.messageModel.create({
      room: new Types.ObjectId(roomId),
      sender: new Types.ObjectId(senderId),
      content,
    });
    return message.populate('sender', 'email displayName') as Promise<MessageDocument>;
  }

  async findMessages(
    roomId: string,
    limit: number,
    before?: string,
  ): Promise<MessageDocument[]> {
    const query: Record<string, unknown> = { room: new Types.ObjectId(roomId) };
    if (before) query._id = { $lt: new Types.ObjectId(before) };
    return this.messageModel
      .find(query)
      .populate('sender', 'email displayName')
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }
}
