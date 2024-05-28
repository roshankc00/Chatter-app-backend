import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsNumber,
  Max,
  Min,
} from 'class-validator';

export class CreateChatDto {
  @ApiProperty({
    example: [1, 2, 3],
    description: 'The ids of users who wana form groups',
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @Transform(({ value }) => value.map(Number))
  @IsNumber({}, { each: true })
  @Min(0, { each: true })
  @Max(100, { each: true })
  userIds: number[];
}
