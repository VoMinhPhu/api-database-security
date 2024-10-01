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

  async create(createFileDto: CreateFileDto): Promise<File> {
    // Kiểm tra file có tồn tại trong cùng thư mục chưa
    const isExist = await this.filesRepository.findOne({
      where: {
        name: createFileDto.name,
        folder: { id: createFileDto.folderId },  // Truy vấn dựa trên quan hệ folder
      },
    });

    if (isExist) {
      throw new BadRequestException('File with the same name already exists in this folder!');
    }

    const file = this.filesRepository.create(createFileDto);
    return await this.filesRepository.save(file);
  }
}
