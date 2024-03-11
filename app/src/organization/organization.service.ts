import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Asset } from 'src/asset/entities/asset.entity';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/user/enums/role.enum';
import { UserService } from 'src/user/user.service';
import { EntityManager, Repository } from 'typeorm';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Organization } from './entities/organization.entity';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private userService: UserService,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createOrganizationDto: CreateOrganizationDto, user: User) {
    if (user.organization) {
      throw new NotAcceptableException(
        'You already belongs to an organization',
      );
    }

    const timestamp = new Date();

    return this.entityManager.transaction(async (manager) => {
      const organization = this.organizationRepository.create({
        ...createOrganizationDto,
        createdBy: user,
        createdAt: timestamp,
        updatedAt: timestamp,
      });

      const newOrganization = await manager.save(organization);

      await manager.update(User, user.id, {
        organization: newOrganization,
        role: Role.ADMIN,
      });

      return newOrganization;
    });
  }

  findAll() {
    return this.organizationRepository.find();
  }

  async findAllUsers(organization: Organization) {
    return await this.userRepository.find({
      where: { organization: organization },
      select: ['id', 'firstName', 'lastName', 'email', 'phoneNumber', 'role'],
    });
  }

  findOne(id: number) {
    return this.organizationRepository.findOne({ where: { id } });
  }

  findOneUser(id: number, organization: Organization) {
    return this.userRepository.findOne({
      where: { organization: organization, id },
      select: ['id', 'firstName', 'lastName', 'email', 'phoneNumber', 'role'],
      relations: ['assets'],
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

    user && delete user.password;

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

  async addMember(userEmail: string, organization: Organization) {
    const user = await this.userService.findByEmail(userEmail);

    if (!user) {
      throw new NotFoundException(`User with email ${userEmail} not found`);
    }

    if (user.organization) {
      throw new NotAcceptableException(
        `User with email ${userEmail} already belongs to an organization`,
      );
    }

    await this.userRepository.update(user.id, {
      organization: organization,
      role: Role.MEMBER,
    });

    return { message: 'User added to the organization' };
  }

  async removeMember(id: number, organization: Organization) {
    const user = await this.userRepository.findOne({
      where: { id: id, organization: organization },
      relations: ['assets'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.entityManager.transaction(async (manager) => {
      if (user.assets.length > 0) {
        for (const asset of user.assets) {
          asset.assignedTo = null;
          await manager.save(asset);
        }
      }

      await manager.update(User, id, {
        organization: null,
        role: Role.MEMBER,
      });
    });

    return { message: 'User removed from the organization' };
  }

  async updateRole(updateRole: UpdateRoleDto, organization: Organization) {
    if (updateRole.role === Role.SUPERADMIN) {
      throw new NotAcceptableException('Role SUPERADMIN is not allowed');
    }

    const userToUpdate = await this.userRepository.findOne({
      where: { id: updateRole.id, organization: organization },
    });

    if (!userToUpdate) {
      throw new NotFoundException(`User with ID ${updateRole.id} not found`);
    }

    if (userToUpdate.role === Role.ADMIN && updateRole.role !== Role.ADMIN) {
      const adminCount = await this.userRepository.count({
        where: { organization: organization, role: Role.ADMIN },
      });

      if (adminCount === 1) {
        throw new NotAcceptableException(
          'Organization must have at least one admin',
        );
      }
    }

    await this.userRepository.update(updateRole.id, { role: updateRole.role });

    return { message: 'User role updated' };
  }
}
