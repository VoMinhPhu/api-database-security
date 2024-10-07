import { Controller, Post, Body, Get, Param, Request, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { FaceService } from './face.service';
import { CreateFaceDto } from './dto/create-face.dto';
import { LoginFaceDto } from './dto/login-face.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('face')
export class FaceController {
  constructor(private readonly faceService: FaceService) { }

  @UseGuards(AuthGuard)
  @Post('register')
  async registerFace(@Body() createFaceDto: CreateFaceDto, @Request() req) {
    const userId = req.user.sub
    return this.faceService.registerFace(createFaceDto, userId);
  }

  @Get(':userId')
  async getByUserId(@Param('userId') userId: number) {
    return await this.faceService.findByUserId(userId);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async loginWithFace(@Body() faceData: LoginFaceDto) {
    return await this.faceService.loginWithFace(faceData.faceDescriptor);
  }
}
