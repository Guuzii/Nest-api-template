import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RegisterDto } from '../authentication/dto/in/register.dto';
import { UserGetDto } from './dto/out/user-get.dto';
import { UserEntity } from './entities/user.entity';
import { UserAuthDto } from './dto/out/user-auth.dto';
import { UserUpdateDto } from './dto/in/user-update.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async getAll(): Promise<UserGetDto[]> {
    const entities: UserEntity[] = await this.usersRepository.find();
    const results: UserGetDto[] = [];

    entities.forEach(async (userEntity: UserEntity) => {
      results.push(new UserGetDto(userEntity));
    });

    return results;
  }

  async getById(userId: number): Promise<UserGetDto | null> {
    const userEntity: UserEntity | null = await this.usersRepository.findOneBy({
      id: userId,
    });
    return userEntity ? new UserGetDto(userEntity) : null;
  }

  async getByEmail(userEmail: string): Promise<UserGetDto | null> {
    const userEntity: UserEntity | null = await this.usersRepository.findOneBy({
      email: userEmail,
    });
    return userEntity ? new UserGetDto(userEntity) : null;
  }

  async create(userInfo: RegisterDto): Promise<UserGetDto> {
    const newUser: UserEntity | null = this.usersRepository.create(userInfo);
    await this.usersRepository.save(newUser);
    return new UserGetDto(newUser);
  }

  /**
   * Met à jours les informations
   * d'un instance UserEntity
   * contrôle l'intégrité des données
   * @param userInfo
   * @returns
   */
  async update(userInfo: UserUpdateDto): Promise<UserGetDto> {
    // on fait directement une recherche avec les deux données importantes
    // qui  ne peuvent être changée en même temps que le reste
    const user: UserEntity | null = await this.usersRepository.findOneBy({
      id: userInfo.id,
      email: userInfo.email,
    });
    if (user) {
      user.firstname = userInfo.firstname;
      user.lastname = userInfo.lastname;

      await this.usersRepository.save(user);

      return new UserGetDto(user);
    } else {
      throw new BadRequestException('user to modify not found');
    }
  }

  async getHashedPwdFromEmail(userEmail: string): Promise<UserAuthDto | null> {
    const userEntity: UserEntity | null = await this.usersRepository.findOneBy({
      email: userEmail,
    });
    return userEntity ? new UserAuthDto(userEntity) : null;
  }
}
