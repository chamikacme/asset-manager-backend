import {
  Body,
  Controller,
  Delete,
  Get,
  NotAcceptableException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetOrganizationDetails, GetUserDetails, Roles } from 'src/auth/decorator';
import { JwtGuard, RolesGuard } from 'src/auth/guard';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/user/enums/role.enum';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationService } from './organization.service';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { Organization } from './entities/organization.entity';

@UseGuards(JwtGuard, RolesGuard)
@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get('me')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.MANAGER, Role.MEMBER)
  getMyOrganization(@GetUserDetails() user: User) {
    if (!user.organization) {
      throw new NotAcceptableException('You do not belong to any organization');
    }
    return this.organizationService.findOne(user.organization.id);
  }

  @Patch('me')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  updateMyOrganization(
    @Body() updateOrganizationDto: UpdateOrganizationDto,
    @GetUserDetails() user: User,
  ) {
    if (!user.organization) {
      throw new NotAcceptableException('You do not belong to any organization');
    }
    return this.organizationService.update(
      user.organization.id,
      updateOrganizationDto,
    );
  }

  @Delete('me')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  removeMyOrganization(@GetUserDetails() user: User) {
    if (!user.organization) {
      throw new NotAcceptableException('You do not belong to any organization');
    }
    return this.organizationService.remove(user.organization.id);
  }

  @Post()
  @Roles(Role.MEMBER)
  create(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @GetUserDetails() user: User,
  ) {
    return this.organizationService.create(createOrganizationDto, user);
  }

  @Get('users')
  @Roles(Role.ADMIN, Role.MANAGER)
  findAllUsers(@GetUserDetails() user: User) {
    if (!user.organization) {
      throw new NotAcceptableException('You do not belong to any organization');
    }
    return this.organizationService.findAllUsers(user.organization);
  }

  @Get('users/:id')
  @Roles(Role.ADMIN, Role.MANAGER)
  findOneUser(@Param('id') id: string, @GetUserDetails() user: User) {
    if (!user.organization) {
      throw new NotAcceptableException('You do not belong to any organization');
    }
    return this.organizationService.findOneUser(+id, user.organization);
  }

  @Patch('users/:id')
  @Roles(Role.ADMIN, Role.MANAGER)
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @GetUserDetails() user: User,
  ) {
    if (!user.organization) {
      throw new NotAcceptableException('You do not belong to any organization');
    }
    return this.organizationService.updateUser(
      +id,
      updateUserDto,
      user.organization,
    );
  }

  @Delete('users/:id')
  @Roles(Role.ADMIN, Role.MANAGER)
  removeUser(@Param('id') id: string, @GetUserDetails() user: User) {
    if (!user.organization) {
      throw new NotAcceptableException('You do not belong to any organization');
    }
    return this.organizationService.removeUser(+id, user.organization);
  }

  @Get()
  @Roles(Role.SUPERADMIN)
  findAll() {
    return this.organizationService.findAll();
  }

  @Get(':id')
  @Roles(Role.SUPERADMIN)
  findOne(@Param('id') id: string) {
    return this.organizationService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.SUPERADMIN)
  update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationService.update(+id, updateOrganizationDto);
  }

  @Delete(':id')
  @Roles(Role.SUPERADMIN)
  remove(@Param('id') id: string) {
    return this.organizationService.remove(+id);
  }

  @Post('add-member')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  addMember(
    @Body('userEmail') userEmail: string,
    @GetUserDetails() user: User,
  ) {
    console.log('user', user);
    
    return this.organizationService.addMember(userEmail, user.organization);
  }

  @Post('remove-member')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  removeMember(
    @Body('userId') userId: number,
    @GetUserDetails() user: User,
  ) {
    return this.organizationService.removeMember(userId, user.organization);
  }
}
