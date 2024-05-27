import { Get, Injectable, UseGuards } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  signupUser(userSignupDto: CreateUserDto) {
    return this.userService.create(userSignupDto);
  }

  async login(user: User, response: Response) {
    const tokenPayload = {
      userId: user.id,
    };

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );

    const token = this.jwtService.sign(tokenPayload, {
      secret: this.configService.get('JWT_SECRET'),
    });

    response.cookie('Authentication', token, {
      expires: new Date(Date.now() + this.configService.get('JWT_EXPIRATION')),
      maxAge: this.configService.get('JWT_EXPIRATION'),
      httpOnly: true,
      secure: true,
    });

    return { token };
  }

  handleGoogleLogin(user: User, response: Response) {
    const tokenPayload = {
      userId: user.id,
    };

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );

    const token = this.jwtService.sign(tokenPayload, {
      secret: this.configService.get('JWT_SECRET'),
    });

    response.cookie('Authentication', token);

    return response.redirect(`${this.configService.get('CLIENT_URL')}`);
  }
}
