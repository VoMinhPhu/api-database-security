import { Controller, Post, Body } from '@nestjs/common';
import { FileService } from './file.service';
import { CreateFileDto } from './dto/create-file.dto';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) { }

  @Post()
  async createFile(@Body() createFileDto: CreateFileDto) {
    return await this.fileService.create(createFileDto);
  }
}
