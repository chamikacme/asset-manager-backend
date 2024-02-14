import { Inject, Injectable, NotAcceptableException } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { SecurityService } from './security.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
    @Inject(SecurityService)
    private readonly securityService: SecurityService,
  ) {}

  async signUp(userDetails: CreateUserDto) {
    const user = await this.userService.findByEmail(userDetails.email);

    if (user) {
      throw new NotAcceptableException('User already exists');
    }

    userDetails.password = await this.securityService.hashPassword(
      userDetails.password,
    );

    const newUser = await this.userService.create(userDetails);

    newUser && delete newUser.password;

    const token = await this.securityService.generateJwt(newUser);

    return {
      user: newUser,
      token,
    };
  }
}
