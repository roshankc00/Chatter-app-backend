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
