import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service'
import { LoginDto } from 'src/auth/dto/login.dto';
import { comparePassword } from 'src/ultils/ultils';
import { JwtService } from '@nestjs/jwt';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
    private transporter;

    constructor(
        private usersService: UserService,
        private jwtService: JwtService
    ) { }

    async login(loginDto: LoginDto): Promise<{ access_token: string }> {
        const user = await this.usersService.findOneByUsername(loginDto.username);
        if (!user) {
            throw new BadRequestException('User is not exist !');
        }

        const comparePass = await comparePassword(loginDto.password, user.password)
        if (!comparePass) {
            throw new UnauthorizedException("Invalid password")
        }

        const payload = { sub: user.id, username: user.username }
        const token = await this.createToken(payload)
        return {
            access_token: token,
        }
    }

    async createToken(payload: Object): Promise<string> {

        return await this.jwtService.signAsync(payload)

    }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByUsername(username);
        const comparePass = await comparePassword(pass, user.password)
        if (user && comparePass) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
}