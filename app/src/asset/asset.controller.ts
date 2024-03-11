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
import { Role } from 'src/user/enums/role.enum';
import { AssetService } from './asset.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { User } from 'src/user/entities/user.entity';

@UseGuards(JwtGuard, RolesGuard)
@Controller('assets')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post()
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  create(@Body() createAssetDto: CreateAssetDto, @GetUserDetails() user: User) {
    return this.assetService.create(createAssetDto, user);
  }

  @Get()
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.MANAGER)
  findAll(@GetUserDetails() user: User) {
    return this.assetService.findAll(user);
  }

  @Get('my-assets')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.MANAGER, Role.MEMBER)
  findMyAssets(@GetUserDetails() user: User) {
    return this.assetService.findMyAssets(user);
  }

  @Get(':id')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.MANAGER, Role.MEMBER)
  findOne(@Param('id') id: string, @GetUserDetails() user: User) {
    return this.assetService.findOne(+id, user);
  }

  @Patch(':id')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.MANAGER)
  update(
    @Param('id') id: string,
    @Body() updateAssetDto: UpdateAssetDto,
    @GetUserDetails() user: User,
  ) {
    return this.assetService.update(+id, updateAssetDto, user);
  }

  @Delete(':id')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  remove(@Param('id') id: string, @GetUserDetails() user: User) {
    return this.assetService.remove(+id, user);
  }

  @Patch(':id/assign')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.MANAGER)
  assignAsset(
    @Param('id') id: string,
    @Body('assignedTo') assignedTo: number,
    @GetUserDetails() user: User,
  ) {
    return this.assetService.assignAsset(+id, assignedTo, user);
  }
}
