import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Face } from './entities/face.entity';
import { FaceService } from './face.service';
import { FaceController } from './face.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Face]), UserModule],
  providers: [FaceService],
  controllers: [FaceController],
})
export class FaceModule { }
