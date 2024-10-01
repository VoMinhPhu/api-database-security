import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity';
import { CreateFileDto } from './dto/create-file.dto';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private filesRepository: Repository<File>,
  ) { }

  async createFile(file: Express.Multer.File, createFileDto: CreateFileDto): Promise<File> {

    const newFile = this.filesRepository.create({
      name: createFileDto.name,
      content: file.buffer,
      type: createFileDto.type,
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
