import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { Asset } from './entities/asset.entity';
import { AssetCondition } from './enums/asset-condition.enum';

@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(Asset)
    private assetRepository: Repository<Asset>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createAssetDto: CreateAssetDto, user: User) {
    const asset = this.assetRepository.create(createAssetDto);
    asset.createdBy = user;
    asset.createdAt = new Date();
    asset.updatedAt = new Date();
    asset.organization = user.organization;
    asset.condition = AssetCondition.WORKING;
    await this.assetRepository.save(asset);
    return { message: 'Asset created successfully' };
  }

  async findAll(user: User) {
    if (user.role === 'superadmin') {
      return await this.assetRepository.find();
    } else if (user.role === 'admin' || user.role === 'manager') {
      return await this.assetRepository.find({
        where: { organization: user.organization },
        relations: ['assignedTo'],
      });
    } else {
      return [];
    }
  }

  async findMyAssets(user: User) {
    return await this.assetRepository.find({
      where: { assignedTo: user },
    });
  }

  async findOne(id: number, user: User) {
    let asset;
    if (user.role === 'superadmin') {
      asset = await this.assetRepository.findOne({
        where: { id },
        relations: ['assignedTo', 'organization', 'createdBy'],
      });
    } else if (user.role === 'admin' || user.role === 'manager') {
      asset = await this.assetRepository.findOne({
        where: { id, organization: user.organization },
        relations: ['assignedTo', 'organization', 'createdBy'],
      });
    } else if (user.role === 'member') {
      asset = await this.assetRepository.findOne({
        where: { id, assignedTo: user },
        relations: ['assignedTo', 'organization'],
      });
    }
    if (!asset) {
      throw new NotFoundException('Asset not found');
    }
    return asset;
  }

  async update(id: number, updateAssetDto: UpdateAssetDto, user: User) {
    let response;

    updateAssetDto.updatedAt = new Date();

    if (user.role === 'superadmin') {
      response = await this.assetRepository.update(id, updateAssetDto);
    } else if (user.role === 'admin' || user.role === 'manager') {
      response = await this.assetRepository.update(
        { id, organization: user.organization },
        updateAssetDto,
      );
    }

    if (response == null || response.affected === 0) {
      throw new NotFoundException('Asset not found');
    }

    return { message: 'Asset updated successfully' };
  }

  async remove(id: number, user: User) {
    let response;
    if (user.role === 'superadmin') {
      response = await this.assetRepository.delete({ id });
    } else {
      response = await this.assetRepository.delete({
        id,
        organization: user.organization,
      });
    }

    if (response == null || response.affected === 0) {
      throw new NotFoundException('Asset not found');
    }

    return { message: 'Asset deleted successfully' };
  }

  async assignAsset(id: number, assignedTo: number, user: User) {
    const asset = await this.findOne(id, user);

    if (assignedTo == null) {
      asset.assignedTo = null;
      asset.updatedAt = new Date();
      await this.assetRepository.save(asset);
      return { message: 'Asset unassigned successfully' };
    }

    let assignedUser;

    if (user.role === 'superadmin') {
      assignedUser = await this.userRepository.findOne({
        where: { id: assignedTo },
        relations: ['organization'],
      });
    } else if (user.role === 'admin' || user.role === 'manager') {
      assignedUser = await this.userRepository.findOne({
        where: { id: assignedTo, organization: user.organization },
        relations: ['organization'],
      });
    }

    if (!assignedUser) {
      throw new NotFoundException('User not found');
    }

    if (asset.organization.id !== assignedUser.organization.id) {
      throw new NotFoundException('User not found in the same organization');
    }

    asset.assignedTo = assignedUser;
    asset.updatedAt = new Date();
    await this.assetRepository.save(asset);
    return { message: 'Asset assigned successfully' };
  }
}
