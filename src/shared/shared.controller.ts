import { Controller, Post, Body } from '@nestjs/common';
import { SharedService } from './shared.service';
import { CreateSharedDto } from './dto/create-shared.dto';
import { Shared } from './entities/shared.entity';

@Controller('shared')
export class SharedController {
  constructor(private readonly sharedService: SharedService) { }

  @Post()
  async create(@Body() createSharedDto: CreateSharedDto): Promise<Shared> {
    return this.sharedService.create(createSharedDto);
  }
}
