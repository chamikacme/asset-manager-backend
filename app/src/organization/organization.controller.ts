import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { JwtGuard, RolesGuard } from 'src/auth/guard';
import { GetUserDetails, Roles } from 'src/auth/decorator';
import { Role } from 'src/user/enums/role.enum';
import { User } from 'src/user/entities/user.entity';

@UseGuards(JwtGuard, RolesGuard)
@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @GetUserDetails() user: User,
  ) {
    return this.organizationService.create(createOrganizationDto, user);
  }

  @Get()
  findAll() {
    return this.organizationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
    @GetUserDetails() user: User,
  ) {
    return this.organizationService.update(+id, updateOrganizationDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationService.remove(+id);
  }

  @Get('me')
  @Roles(Role.ADMIN, Role.MANAGER, Role.USER)
  getMyOrganization(@GetUserDetails() user: User) {
    return this.organizationService.findOne(user.organization.id);
  }

  @Patch('me')
  @Roles(Role.ADMIN)
  updateMyOrganization(
    @Body() updateOrganizationDto: UpdateOrganizationDto,
    @GetUserDetails() user: User,
  ) {
    return this.organizationService.update(
      user.organization.id,
      updateOrganizationDto,
      user,
    );
  }

  @Delete('me')
  @Roles(Role.ADMIN)
  removeMyOrganization(@GetUserDetails() user: User) {
    return this.organizationService.remove(user.organization.id);
  }
}
