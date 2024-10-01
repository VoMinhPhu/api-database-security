import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { FolderService } from './folder.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { Folder } from './entities/folder.entity';

@Controller('folder')
export class FolderController {
  constructor(private readonly folderService: FolderService) { }

  @Post()
  async createFolder(@Body() createFolderDto: CreateFolderDto) {
    return await this.folderService.create(createFolderDto);
  }

  @Get(':id')
  async getFolder(@Param('id') id: number): Promise<Folder> {
    return this.folderService.getFolderById(id);
  }
}
