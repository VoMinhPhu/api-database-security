import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Face } from './entities/face.entity';
import { FaceService } from './face.service';
import { FaceController } from './face.controller';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { AuthGuard } from 'src/auth/auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Face]), UserModule, AuthModule],
  providers: [FaceService, AuthGuard],
  controllers: [FaceController],
})
export class FaceModule { }
