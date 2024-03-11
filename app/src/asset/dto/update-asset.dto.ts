import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { AssetCondition } from '../enums/asset-condition.enum';
import { CreateAssetDto } from './create-asset.dto';

class CompleteUpdateAssetDto extends CreateAssetDto {
  @IsString({ message: 'Name must be a string' })
  @IsOptional()
  name: string;

  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description: string;

  @IsEnum(AssetCondition, {
    message:
      'Condition must be either "working" | "needs_maintenance" | "not_working" | "disposed"',
  })
  @IsOptional()
  condition: AssetCondition;

  updatedAt: Date;
}

export class UpdateAssetDto extends PartialType(CompleteUpdateAssetDto) {}
