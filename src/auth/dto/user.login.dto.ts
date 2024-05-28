import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UserLoginDto {
  @ApiProperty({
    example: 'roshan@gmail.com',
    description: 'The Email of the User',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password___',
    description: 'The password of the User',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
