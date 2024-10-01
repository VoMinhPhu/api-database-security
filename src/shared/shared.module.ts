import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { SharedController } from './shared.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shared } from './entities/shared.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Shared])],
  controllers: [SharedController],
  providers: [SharedService],
  exports: [SharedService],
})
export class SharedModule { }
