import { Module } from '@nestjs/common';
import { AssetService } from './asset.service';
import { AssetController } from './asset.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from './entities/asset.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Asset]),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AssetController],
  providers: [AssetService],
})
export class AssetModule {}
