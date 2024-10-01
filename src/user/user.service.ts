import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hashPassword } from 'src/ultils/ultils';
import { UserRes } from './dto/user-res.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<UserRes> {
    const isExist = await this.usersRepository.findOneBy({ username: createUserDto.username });
    if (isExist) {
      throw new ConflictException("Username already exists!");
    }

    const hashPass = await hashPassword(createUserDto.password)

    createUserDto = {
      ...createUserDto,
      password: hashPass
    }

    const user = this.usersRepository.create(createUserDto);
    const save = await this.usersRepository.save(user);
    const { password, ...results } = save
    return results
  }

  async findOneByUsername(username: string): Promise<User | undefined> {
    return await this.usersRepository.findOneBy({ username })
  }

  async getUserById(id: number): Promise<UserRes> {
    const isExist = await this.usersRepository.findOneBy({ id });
    if (!isExist) {
      throw new NotFoundException("Invalid id user !")
    }
    const { password, ...results } = isExist
    return results
  }

}
