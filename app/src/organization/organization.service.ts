import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from './entities/organization.entity';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
  ) {}

  create(createOrganizationDto: CreateOrganizationDto, user: User) {
    const timestamp = new Date();
    const newOrganization = this.organizationRepository.create({
      ...createOrganizationDto,
      createdBy: user,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    return this.organizationRepository.save(newOrganization);
  }

  findAll() {
    return this.organizationRepository.find();
  }

  findOne(id: number) {
    return this.organizationRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateOrganizationDto: UpdateOrganizationDto,
    user: User,
  ) {
    const organization = await this.findOne(id);

    if (!organization) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }

    const updatedOrganization = {
      ...updateOrganizationDto,
      updatedAt: new Date(),
    };

    await this.organizationRepository.update(id, updatedOrganization);

    return { ...organization, ...updatedOrganization };
  }

  remove(id: number) {
    return this.organizationRepository.delete(id);
  }
}
