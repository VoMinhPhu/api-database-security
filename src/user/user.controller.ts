import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.userService.login(loginDto);
  }

}
