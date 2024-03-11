import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { Role } from 'src/user/enums/role.enum';

export class UpdateRoleDto {
  @IsNumber({}, { message: 'Id must be a number' })
  @IsNotEmpty({ message: 'Id is required' })
  id: number;

  @IsEnum(Role, { message: 'Role must be a valid role' })
  @IsNotEmpty({ message: 'Role is required' })
  role: Role;
}
