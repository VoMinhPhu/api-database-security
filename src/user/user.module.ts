import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigService } from '@nestjs/config';
import * as OracleDB from 'oracledb'; // Sử dụng import * as OracleDB

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: 'ORACLE_CONNECTION', // Sử dụng một tên provider duy nhất
      useFactory: async (configService: ConfigService) => {
        try {
          const connection = await OracleDB.getConnection({
            user: configService.get('DATABASE_USERNAME'), // Sửa 'username' thành 'user'
            password: configService.get('DATABASE_PASS'),
            connectString: `${configService.get('DATABASE_HOST')}:${configService.get('DATABASE_PORT')}/${configService.get('DATABASE_SERVICENAME')}`,
          });
          return connection;
        } catch (error) {
          console.error('Error connecting to OracleDB:', error); // Log lỗi
          throw error; // Ném lại lỗi để xử lý ở nơi khác
        }
      },
      inject: [ConfigService], // Đảm bảo inject ConfigService
    },
  ],
  exports: [UserService, 'ORACLE_CONNECTION'],
})
export class UserModule { }
