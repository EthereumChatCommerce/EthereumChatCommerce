import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RoomDocument = HydratedDocument<Room>;

@Schema({ timestamps: true })
export class Room {
  @Prop({ type: [Types.ObjectId], ref: 'User', required: true })
  participants: Types.ObjectId[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);

// For 1:1 chat: ensure unique pair (sorted participant ids)
RoomSchema.index(
  { participants: 1 },
  { unique: true },
);
