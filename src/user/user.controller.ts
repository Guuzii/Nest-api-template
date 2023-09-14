import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import { EmailValidationPipe } from '../common/pipe/email-validation.pipe';
import { UserService } from './user.service';
import { UserGetDto } from 'src/common/dto/user/uset-get.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('all')
  async findAll(): Promise<UserGetDto[]> {
    return await this.userService.getAll();
  }

  @Get('/byId/:id')
  async findById(@Param('id', ParseIntPipe) userId: number): Promise<UserGetDto | undefined> {
    return await this.userService.getById(userId);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/byEmail')
  async findByEmail(
    @Body('email', EmailValidationPipe) userEmail: string,
  ): Promise<UserGetDto | undefined> {
    return await this.userService.getByEmail(userEmail);
  }
}
