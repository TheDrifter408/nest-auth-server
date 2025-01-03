import { PassportStrategy } from '@nestjs/passport';
import { OAuth2Strategy, VerifyFunction } from 'passport-google-oauth';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(OAuth2Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google-redirect',
      scope: ['email', 'profile'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    verify: VerifyFunction,
  ): Promise<any> {
    const { name, emails } = profile;
    const user = {
      name: `${name.givenName} ${name.familyName}`,
      email: emails[0].value,
      accessToken,
      refreshToken,
    };
    verify(null, user);
    return user;
  }
}
