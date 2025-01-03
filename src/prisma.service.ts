import {
  Injectable,
  OnModuleInit,
  RequestTimeoutException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      throw new RequestTimeoutException(error);
    }
  }
}
