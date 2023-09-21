import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { RegisterDto } from './dto/in/register.dto';
import { LoginDto } from './dto/in/login.dto';
import { UserService } from '../user/user.service';
import { UserGetDto } from '../user/dto/out/user-get.dto';
import { AccessTokenDto } from './dto/out/access-token.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(userInfo: RegisterDto): Promise<UserGetDto> {
    return await this.userService.create(userInfo);
  }

  async login(userInfo: LoginDto): Promise<AccessTokenDto> {
    const foundUser: any = await this.userService.getHashedPwdFromEmail(
      userInfo.email,
    );
    if (foundUser?.password !== userInfo.password)
      throw new UnauthorizedException('Wrong email or password');

    const payload = { sub: foundUser.id, username: foundUser.email };
    const response: AccessTokenDto = {
      accessToken: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRE,
      }),
    };

    return response;
  }
}
