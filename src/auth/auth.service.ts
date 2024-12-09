import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { User } from '@prisma/client';
import { UserDto } from 'src/proto/auth';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  loginUser(data: UserDto) {
    console.log(data);
    return {
      token: this.jwtService.sign(data),
    };
  }
  async validateUser(userEmail: string, userPassword: string): Promise<User> {
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
