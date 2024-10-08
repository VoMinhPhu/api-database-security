import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { comparePassword, hashPassword } from 'src/ultils/ultils';
import { UserRes } from './dto/user-res.dto';
import { MailerService } from "@nestjs-modules/mailer";
import OracleDB from 'oracledb';

@Injectable()
export class UserService {
  private readonly shift = 3;
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private mailerService: MailerService,
    @Inject('ORACLE_CONNECTION') private connection: OracleDB.Connection // Sử dụng kiểu đúng cho kết nối
  ) { }
  async encryptPhone(phone: string, shift: number): Promise<string> {
    const result = await this.connection.execute(
      `SELECT encrypt_phone(:phone, :shift) AS encrypted_phone FROM dual`,
      { phone, shift }
    );
    return result.rows[0][0]; // Trả về số điện thoại đã mã hóa
  }

  async decryptPhone(encryptedPhone: string, shift: number): Promise<string> {
    const result = await this.connection.execute(
      `SELECT decrypt_phone(:encryptedPhone, :shift) AS decrypted_phone FROM dual`,
      { encryptedPhone, shift }
    );
    return result.rows[0][0]; // Trả về số điện thoại đã giải mã
  }

  async create(createUserDto: CreateUserDto): Promise<UserRes> {
    const { username, phone } = createUserDto

    const isExist = await this.usersRepository.findOneBy({ username });
    if (isExist) {
      throw new ConflictException("Username already exists!");
    }

    const hashPass = await hashPassword(createUserDto.password)

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const encryptedPhone = await this.encryptPhone(phone, this.shift);
    createUserDto = {
      ...createUserDto,
      phone: encryptedPhone,
      password: hashPass,
      otp: otp,
      isVerified: false
    }

    const user = this.usersRepository.create(createUserDto);
    const save = await this.usersRepository.save(user);
    await this.sendOtpEmail(user.username, otp);
    const { password, ...results } = save
    return results
  }

  async sendOtpEmail(email: string, otp: string): Promise<void> {
    await this.mailerService.sendMail({
      from: "Google Drive <gg.drive.services@gmail.com>",
      to: email,
      subject: "Xác thực mã OTP",
      template: "./confirmation",
      context: { email, otp }
    });
  }

  async verifyOtp(username: string, otp: string): Promise<{ message: string }> {
    const user = await this.usersRepository.findOneBy({ username });

    if (!user) {
      throw new BadRequestException("Invalid username");
    }

    if (user.otp !== otp) {
      throw new BadRequestException("Invalid OTP");
    }

    user.isVerified = true;
    user.otp = "null";
    await this.usersRepository.save(user);
    return { message: "Verified succesfully !" }
  }

  async findOneByUsername(username: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOneBy({ username })
    if (user && user.phone) {
      user.phone = await this.decryptPhone(user.phone, this.shift);
    }
    return user
  }

  async getUserById(id: number): Promise<UserRes> {
    const isExist = await this.usersRepository.findOneBy({ id });
    if (!isExist) {
      throw new NotFoundException("Invalid id user !")
    }
    isExist.phone = await this.decryptPhone(isExist.phone, this.shift)

    const { password, ...results } = isExist
    return results
  }

  async changePassword(oldPass: string, newPass: string, id: number): Promise<{ message: string }> {
    const user = await this.usersRepository.findOneBy({ id })

    const comparePass = await comparePassword(oldPass, user.password)
    if (!comparePass) {
      throw new BadRequestException("Invalid password")
    } else {
      const hashPass = await hashPassword(newPass)
      user.password = hashPass
      await this.usersRepository.save(user);
    }
    return { message: "Change password successfully !" }
  }

}
