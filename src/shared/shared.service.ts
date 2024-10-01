import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shared } from './entities/shared.entity';
import { CreateSharedDto } from './dto/create-shared.dto';

@Injectable()
export class SharedService {
  constructor(
    @InjectRepository(Shared)
    private sharedRepository: Repository<Shared>,
  ) { }

  async create(createSharedDto: CreateSharedDto): Promise<Shared> {
    const shared = this.sharedRepository.create(createSharedDto);
    return await this.sharedRepository.save(shared);
  }
}
