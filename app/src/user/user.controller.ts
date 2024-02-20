import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUserDetails, Roles } from 'src/auth/decorator';
import { JwtGuard, RolesGuard } from 'src/auth/guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './enums/role.enum';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

@UseGuards(JwtGuard, RolesGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @Roles(Role.ADMIN, Role.MANAGER, Role.USER)
  me(@GetUserDetails() user: User) {
    return this.userService.findOne(user.id);
  }

  @Patch('me')
  @Roles(Role.ADMIN, Role.MANAGER, Role.USER)
  updateMe(@GetUserDetails() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(user.id, updateUserDto);
  }

  @Delete('me')
  @Roles(Role.ADMIN, Role.MANAGER, Role.USER)
  removeMe(@GetUserDetails() user: User) {
    return this.userService.remove(user.id);
  }

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Roles(Role.SUPERADMIN)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @Roles(Role.SUPERADMIN)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.SUPERADMIN)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.SUPERADMIN)
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
