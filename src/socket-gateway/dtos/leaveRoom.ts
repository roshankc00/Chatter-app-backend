import { ApiProperty } from '@nestjs/swagger';

export class LeaveRoomDto {
  @ApiProperty({ example: 1, description: 'The ID of the chat room to leave' })
  chatId: number;
}
