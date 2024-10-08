import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/auth/dto/login.dto';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UserService
    ) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body() signInDto: LoginDto) {
        return await this.authService.login(signInDto);
    }

    @Post("verify-otp")
    async verifyOtp(@Body("username") username: string, @Body("otp") otp: string) {
        return this.userService.verifyOtp(username, otp);
    }
}