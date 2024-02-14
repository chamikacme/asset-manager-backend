import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { SecurityService } from './security.service';
import { JwtStrategy } from './strategy';
import { Organization } from 'src/organization/entities/organization.entity';
import { OrganizationService } from 'src/organization/organization.service';
import { OrganizationModule } from 'src/organization/organization.module';

@Module({
  imports: [
    UserModule,
    OrganizationModule,
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Organization]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    OrganizationService,
    SecurityService,
    JwtStrategy,
  ],
})
export class AuthModule {}
