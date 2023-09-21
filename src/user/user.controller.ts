import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UserService } from './user.service';
import { UserGetDto } from './dto/out/user-get.dto';
import { StringEmailDto } from '../common/dto/string-email.dto';
import { UserUpdateDto } from './dto/in/user-update.dto';

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({
    description: 'A list of all users',
    type: [UserGetDto],
  })
  @Get('all')
  async findAll(): Promise<UserGetDto[]> {
    return await this.userService.getAll();
  }

  @ApiResponse({
    description: 'The user with specified id',
    type: UserGetDto,
  })
  @Get('/byId/:id')
  async findById(
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<UserGetDto | null> {
    return await this.userService.getById(userId);
  }

  @ApiResponse({
    description: 'The user with specified email',
    type: UserGetDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('/byEmail')
  async findByEmail(
    @Body() stringEmailDto: StringEmailDto,
  ): Promise<UserGetDto | null> {
    return await this.userService.getByEmail(stringEmailDto.email);
  }

  /**
   * reception un UserUpdateDTO au user.service
   * pour une mise à jour d'une entitée existante
   * @param user
   * @returns UserUpdateDTO
   */
  @ApiResponse({
    description: 'The updated user ',
    type: UserGetDto,
  })
  @HttpCode(HttpStatus.ACCEPTED)
  @Put('/update')
  async update(@Body() user: UserUpdateDto): Promise<UserGetDto> {
    return await this.userService.update(user);
  }
}
