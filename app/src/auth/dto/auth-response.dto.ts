import { User } from '../../user/entities/user.entity';

export default class AuthResponseDto {
  user: User;
  token: string;

  constructor(user: User, token: string) {
    this.user = user;
    this.token = token;
  }
}
