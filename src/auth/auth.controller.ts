import { Controller, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './googleAuth.guard';
import { Request } from 'express';
import {
  LoginServiceController,
  LoginServiceControllerMethods,
  Token,
  UserDto,
} from 'src/proto/auth';
import { Observable } from 'rxjs';
@Controller()
@LoginServiceControllerMethods()
export class AuthController implements LoginServiceController {
  constructor(private authService: AuthService) {}
  login(request: UserDto): Promise<Token> | Observable<Token> | Token {
    const token = this.authService.loginUser(request);
    return token;
  }
  async getProfile(@Req() req: Request) {
    return `Hi ${req.user['email']} you are in your profile`;
  }
  //The guard is being used to execute the google strategy which calls the validate function
  //At first the /auth/google endpoint is hit which redirects the user to a different url and asks for authentication
  //After the user agrees the GoogleStrategy's 'validate' function then runs.
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}

  @UseGuards(GoogleAuthGuard)
  googleRedirect(@Req() req: Request) {
    return `Hi, ${req.user['name']} from google`;
  }
}
