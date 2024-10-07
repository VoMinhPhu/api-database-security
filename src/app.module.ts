import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { FileModule } from './file/file.module';
import { File } from './file/entities/file.entity';
import { FolderModule } from './folder/folder.module';
import { Folder } from './folder/entities/folder.entity';
import { SharedModule } from './shared/shared.module';
import { Shared } from './shared/entities/shared.entity';
import { AuthModule } from './auth/auth.module';
import { FaceModule } from './face/face.module';
import { Face } from './face/entities/face.entity';

@Module({
  imports: [
    UserModule, AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'oracle',
        connectString: `${configService.get('DATABASE_HOST')}:${configService.get('DATABASE_PORT')}/${configService.get('DATABASE_SERVICENAME')}`,
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASS'),
        entities: [User, File, Folder, Shared, Face],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    FileModule,
    FolderModule,
    SharedModule,
    FaceModule,
  ],
})
export class AppModule { }
