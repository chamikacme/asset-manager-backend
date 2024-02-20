import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organization]),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService],
})
export class OrganizationModule {}
