import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UserMessageDto {
  @ApiProperty({ example: 1, description: 'The ID of the chat room' })
  chatId: number;

  @ApiProperty({
    example: 'Hello, world!',
    description: 'The content of the message',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: 1,
    description: 'The ID of the user sending the message',
  })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user sending the message',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
