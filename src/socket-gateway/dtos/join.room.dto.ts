import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class JoinRoomDto {
  @ApiProperty({ example: 1, description: 'The ID of the chat room to join' })
  @IsNotEmpty()
  @IsNumber()
  chatId: number;
}
