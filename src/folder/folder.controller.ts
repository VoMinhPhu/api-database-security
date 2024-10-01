import { Controller, Post, Body } from '@nestjs/common';
import { FolderService } from './folder.service';
import { CreateFolderDto } from './dto/create-folder.dto';

@Controller('folder')
export class FolderController {
  constructor(private readonly folderService: FolderService) { }

  @Post()
  async createFolder(@Body() createFolderDto: CreateFolderDto) {
    return await this.folderService.create(createFolderDto);
  }
}
