import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service'
import { LoginDto } from 'src/auth/dto/login.dto';
import { comparePassword } from 'src/ultils/ultils';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
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

        return {
            access_token: await this.jwtService.signAsync(payload),
        }
    }
}