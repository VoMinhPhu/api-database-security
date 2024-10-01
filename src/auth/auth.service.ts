import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service'
import { LoginDto } from 'src/auth/dto/login.dto';
import { comparePassword } from 'src/ultils/ultils';
@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService
    ) { }

    async login(loginDto: LoginDto): Promise<any> {
        const user = await this.usersService.findOneByUsername(loginDto.username);
        if (!user) {
            throw new BadRequestException('User is not exist !');
        }

        const comparePass = await comparePassword(loginDto.password, user.password)
        if (!comparePass) {
            throw new UnauthorizedException("Invalid password")
        }

        let { password, ...currUser } = user

        return currUser;
    }
}