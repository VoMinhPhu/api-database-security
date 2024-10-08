import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module'
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { MailerModule } from '@nestjs-modules/mailer';
import * as path from "path";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
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
    ConfigModule.forRoot(),
    MailerModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
            transport: {
                host: configService.get("MAIL_HOST"),
                port: configService.get("MAIL_PORT"),
                auth: {
                    user: configService.get("MAIL_USER"),
                    pass: configService.get("MAIL_PASSWORD")
                }
            },
            defaults: {
                from: `"No Reply" <${configService.get("MAIL_FROM")}>`
            },
            template: {
                dir: path.join(process.cwd(), "dist/src/auth/templates"),
                adapter: new HandlebarsAdapter(),
                options: {
                    extName: ".hbs",
                    layoutsDir: path.join(process.cwd(), "dist/src/auth/templates/layouts")
                }
            }
        }),
        inject: [ConfigService]
    })
    ],
    providers: [AuthService, LocalStrategy],
    controllers: [AuthController],
    exports: [AuthService, JwtModule]
})
export class AuthModule { }