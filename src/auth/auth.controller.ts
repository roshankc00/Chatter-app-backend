import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { Response } from 'express';

import { JWtAuthGuard } from './guards/jwt.auth.guard';
import { GoogleAuthGuard } from './guards/google.auth.guard';
import { ConfigService } from '@nestjs/config';
import { Currentuser } from 'src/common/decorators/getCurrentUser.decorator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup')
  @ApiOperation({
    summary: 'Register the user ',
  })
  @ApiResponse({
    status: 201,
    description: 'It will return the  register user with the given details',
  })
  signupUser(@Body() userSignupDto: CreateUserDto) {
    return this.authService.signupUser(userSignupDto);
  }
  @Post('login')
  @ApiOperation({
    summary: 'Login the user',
  })
  @ApiResponse({
    status: 200,
    description: 'It will return the token in the cookie',
  })
  @UseGuards(LocalAuthGuard)
  async login(
    @Currentuser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    console.log(user);
    return this.authService.login(user, response);
  }

  @Get('me')
  @ApiOperation({
    summary: 'Get Loged in user',
  })
  @ApiResponse({
    status: 200,
    description: 'It will return the logged in user details ',
  })
  @UseGuards(JWtAuthGuard)
  async getUser(@Currentuser() user: User) {
    return user;
  }

  @Get('google/callback')
  @ApiOperation({
    summary: 'Google authentication',
  })
  @ApiResponse({
    status: 200,
    description:
      'Redirect it when user tab on google login. It will store userdetail if its  first time and store token in the cookie',
  })
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(
    @Currentuser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.handleGoogleLogin(user, response);
  }

  @Post('logout')
  @ApiOperation({
    summary: 'Logout user',
  })
  @ApiResponse({
    status: 200,
    description: 'Simply removed the cookie ',
  })
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('Authentication');
    return {
      statusCode: HttpStatus.OK,
      message: 'Logged out successfully',
    };
  }
}
