import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { PaginataionDto } from 'src/common/dtos/pagination.dto';

export class FindAllMessageDto extends PaginataionDto {
  @ApiProperty({ example: 1, description: 'The ID of the chat room' })
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  chatId: number;
}
