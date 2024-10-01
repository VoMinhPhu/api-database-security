import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;

    @IsString()
    phone: string;

    @IsString()
    address: string;
}
