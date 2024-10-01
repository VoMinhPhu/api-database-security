import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { comparePassword, hashPassword } from 'src/ultils/ultils';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const isExist = await this.usersRepository.findOneBy({ username: createUserDto.username });
    if (isExist) {
      throw new BadRequestException("Username already exists!");
    }

    const hashPass = await hashPassword(createUserDto.password)

    createUserDto = {
      ...createUserDto,
      password: hashPass
    }

    const user = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(user);
  }

  async login(loginDto: LoginDto): Promise<any> {
    const user = await this.usersRepository.findOneBy({ username: loginDto.username });
    if (!user) {
      throw new BadRequestException('User is not exist !');
    }

    const comparePass = await comparePassword(loginDto.password, user.password)
    if (!comparePass) {
      throw new BadRequestException("Invalid password")
    }

    let { password, ...currUser } = user

    return currUser;
  }


}
