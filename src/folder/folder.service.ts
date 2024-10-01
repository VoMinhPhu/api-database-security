import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Folder } from './entities/folder.entity';
import { CreateFolderDto } from './dto/create-folder.dto';

@Injectable()
export class FolderService {
  constructor(
    @InjectRepository(Folder)
    private foldersRepository: Repository<Folder>,
  ) { }

  async create(createFolderDto: CreateFolderDto): Promise<Folder> {
    // Kiểm tra thư mục cùng tên trong cùng thư mục cha
    const isExist = await this.foldersRepository.findOne({
      where: {
        name: createFolderDto.name,
        parentFolder: { id: createFolderDto.parentFolderId },  // Truy vấn dựa trên quan hệ parentFolder
      },
    });

    if (isExist) {
      throw new BadRequestException("Folder with the same name already exists in this directory!");
    }

    const folder = this.foldersRepository.create(createFolderDto);
    return await this.foldersRepository.save(folder);
  }

  async getFolderById(id: number): Promise<Folder> {
    const folder = await this.foldersRepository.findOne({
      where: { id },
    });
    if (!folder) {
      throw new NotFoundException(`Folder with ID ${id} not found.`);
    }
    return folder;
  }
}
