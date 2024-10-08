import { Controller, Post, Body, Request, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  async getInfoUser(@Request() req) {
    return await this.userService.getUserById(req.user.sub)
  }

  @UseGuards(AuthGuard)
  @Post('change-password')
  async changePassword(@Body("oldPass") oldPass: string, @Body("newPass") newPass: string, @Request() req) {
    return await this.userService.changePassword(oldPass, newPass, req.user.sub)
  }
}
