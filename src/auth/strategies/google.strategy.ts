import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { UsersService } from 'src/users/users.service';
import 'dotenv/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly usersService: UsersService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET_ID,
      callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const { id, displayName, emails } = profile;
    const user = {
      id,
      email: emails[0].value,
      name: displayName,
    };

    const existingUser = await this.usersService.validateUserGoogle(
      user.email,
      user.name,
    );

    if (existingUser) {
      return done(null, existingUser);
    }
    return done(null, user);
  }
}
