import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity';
import { CreateFileDto } from './dto/create-file.dto';
import { Folder } from 'src/folder/entities/folder.entity';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private filesRepository: Repository<File>,
    @InjectRepository(Folder)
    private foldersRepository: Repository<Folder>,
  ) { }

  async createFile(file: Express.Multer.File, createFileDto: CreateFileDto): Promise<File> {

    if (createFileDto.folderId) {
      const folder = await this.foldersRepository.findOne({
        where: { id: createFileDto.folderId }
      })
      if (!folder) {
        throw new NotFoundException(`Folder with ID ${createFileDto.folderId} not found.`);
      }
    }


    const newFile = this.filesRepository.create({
      name: file.originalname,
      content: file.buffer,
      type: file.mimetype,
      size: file.size,
      user: { id: createFileDto.userId },
      folder: createFileDto.folderId ? { id: createFileDto.folderId } : null,
    });

    try {
      return await this.filesRepository.save(newFile);
    } catch (error) {
      console.error('Error saving file:', error);
      throw new BadRequestException('Could not save file.');
    }
  }
}
