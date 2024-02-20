import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from './entities/organization.entity';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
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

  findAllUsers(organization: Organization) {
    return this.userRepository.find({ where: { organization: organization } });
  }

  findOne(id: number) {
    return this.organizationRepository.findOne({ where: { id } });
  }

  findOneUser(id: number, organization: Organization) {
    return this.userRepository.findOne({
      where: { organization: organization, id },
    });
  }

  async update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
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

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
    organization: Organization,
  ) {
    const user = await this.userRepository.findOne({
      where: { id: id, organization: organization },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.userRepository.update(id, updateUserDto);

    return { ...user, ...updateUserDto };
  }

  async removeUser(id: number, organization: Organization) {
    const user = await this.userRepository.findOne({
      where: { id: id, organization: organization },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.userRepository.delete(id);
  }

  remove(id: number) {
    return this.organizationRepository.delete(id);
  }
}
