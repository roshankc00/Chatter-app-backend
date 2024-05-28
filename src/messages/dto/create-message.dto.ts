import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({ example: 'Hello', description: 'The message of user' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: 1, description: 'The ID of the chat room' })
  @IsNotEmpty()
  @IsNumber()
  chatId: number;

  @ApiProperty({ example: 1, description: 'The ID of the User' })
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
