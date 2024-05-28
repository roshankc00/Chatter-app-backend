import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class LeaveRoomDto {
  @ApiProperty({ example: 1, description: 'The ID of the chat room to leave' })
  @IsNotEmpty()
  @IsNumber()
  chatId: number;
}
