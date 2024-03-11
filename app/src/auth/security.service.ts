import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SecurityService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async hashPassword(password: string) {
    return await hash(password, 10);
  }

  async comparePassword(password: string, hash: string) {
    return await compare(password, hash);
  }

  async generateJwt(user: User) {
    const payload = { sub: user.id };
    return await this.jwtService.signAsync(payload, {
      expiresIn: '1d',
      secret: this.configService.get('JWT_SECRET'),
    });
  }
}
