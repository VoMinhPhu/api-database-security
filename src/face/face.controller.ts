import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { FaceService } from './face.service';
import { CreateFaceDto } from './dto/create-face.dto';
import { LoginFaceDto } from './dto/login-face.dto';

@Controller('face')
export class FaceController {
  constructor(private readonly faceService: FaceService) { }

  @Post('register')
  async registerFace(@Body() createFaceDto: CreateFaceDto) {
    return this.faceService.registerFace(createFaceDto);
  }

  @Get(':userId')
  async getByUserId(@Param('userId') userId: number) {
    return await this.faceService.findByUserId(userId);
  }

  @Post('login-with-face')
  async loginWithFace(@Body() faceData: LoginFaceDto) {
    const user = await this.faceService.loginWithFace(faceData.faceDescriptor);
    if (user) {
      return { message: 'Login successful', user };
    }
    return { message: 'Face not recognized' };
  }
}
