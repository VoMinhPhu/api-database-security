import { Controller, Post, Body, UseInterceptors, UploadedFile, Request, UseGuards } from '@nestjs/common';
import { FileService } from './file.service';
import { CreateFileDto } from './dto/create-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) { }

  @UseGuards(AuthGuard)
  @Post('create')
  @UseInterceptors(FileInterceptor('content'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createFileDto: CreateFileDto,
    @Request() req) {
    const userId = req.user.sub
    createFileDto.userId = userId
    return this.fileService.createFile(file, createFileDto)
  }
}
