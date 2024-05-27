import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { Request, Response } from 'express';

import { JWtAuthGuard } from './guards/jwt.auth.guard';
import { join } from 'path';

import { readFileSync } from 'fs';
import { GoogleAuthGuard } from './guards/google.auth.guard';
import { ConfigService } from '@nestjs/config';
import { Currentuser } from 'src/common/decorators/getCurrentUser.decorator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}
  @Post('signup')
  signupUser(@Body() userSignupDto: CreateUserDto) {
    return this.authService.signupUser(userSignupDto);
  }
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @Currentuser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    console.log(user);
    return this.authService.login(user, response);
  }

  @Get('me')
  @UseGuards(JWtAuthGuard)
  async getUser(@Currentuser() user: User) {
    return user;
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(
    @Currentuser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.handleGoogleLogin(user, response);
  }
}
