import { ApiProperty } from '@nestjs/swagger';

export class UserMessageDto {
  @ApiProperty({ example: 1, description: 'The ID of the chat room' })
  chatId: number;

  @ApiProperty({
    example: 'Hello, world!',
    description: 'The content of the message',
  })
  content: string;

  @ApiProperty({
    example: 1,
    description: 'The ID of the user sending the message',
  })
  userId: number;

  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user sending the message',
  })
  name: string;
}
