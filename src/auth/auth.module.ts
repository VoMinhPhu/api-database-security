import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module'
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
@Module({
    imports: [forwardRef(() => UserModule), PassportModule,
    JwtModule.registerAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
            global: true,
            secret: configService.get<string>('JWT_SECRET_KEY'),
            signOptions: {
                expiresIn: configService.get<string>('JWT_EXPIRED_TIME'),
            },
        }),
        inject: [ConfigService],
    }),

    ],
    providers: [AuthService, LocalStrategy],
    controllers: [AuthController],
    exports: [AuthService, JwtModule]
})
export class AuthModule { }