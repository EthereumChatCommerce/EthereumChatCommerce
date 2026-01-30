import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'Other user ID' })
  @IsString()
  @IsMongoId()
  otherUserId: string;
}
