import {
  IsAlpha,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsAlpha('en-US', { message: 'First name must contain only letters' })
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @IsAlpha('en-US', { message: 'Last name must contain only letters' })
  @IsOptional()
  lastName: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email is invalid' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  password: string;

  @IsOptional()
  @Matches(/^\+\d{7,15}$/, { message: 'Invalid mobile number' })
  phoneNumber: string;
}
