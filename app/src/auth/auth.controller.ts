import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from './auth.service';
import { GetUserDetails } from './decorator';
import SignInDto from './dto/sign-in.dto';
import { JwtGuard } from './guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() userDetails: CreateUserDto) {
    return this.authService.signUp(userDetails);
  }

  @HttpCode(200)
  @Post('signin')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @HttpCode(200)
  @UseGuards(JwtGuard)
  @Get('validate-user')
  validateUser(@GetUserDetails() user: User) {
    return user;
  }
}
