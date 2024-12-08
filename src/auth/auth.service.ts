import {
  Injectable,
  InternalServerErrorException,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserDTO } from 'src/dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { Request, Response } from 'express';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async loginUser(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const payload = { sub: req.user['id'], email: req.user['email'] };
    const jwt = this.jwtService.sign(payload);
    res.cookie('accessToken', jwt, {
      expires: new Date(new Date().getTime() + 30 * 1000),
      sameSite: 'strict',
      httpOnly: true,
    });
    const message = {
      message: 'Check your cookies',
    };
    return res.send(message);
  }
  async validateUser(
    userEmail: string,
    userPassword: string,
  ): Promise<UserDTO> {
    try {
      //Checking if a user exists with the particular email submitted
      const user = await this.prisma.user.findUnique({
        where: {
          email: userEmail,
        },
      });
      if (user) {
        const checkPassword = await bcrypt.compare(userPassword, user.password);
        if (checkPassword) {
          return user;
        } else {
          throw new UnauthorizedException('Password Does Not Match!');
        }
      } else {
        throw new UnauthorizedException('Incorrect Email!');
      }
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
