import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserDTO } from 'src/dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async login(id: number, email: string) {
    const payload = { sub: id, email };
    return {
      access_token: this.jwtService.sign(payload),
    };
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
