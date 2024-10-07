import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Face } from './entities/face.entity';
import { CreateFaceDto } from './dto/create-face.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { UserRes } from 'src/user/dto/user-res.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class FaceService {
  private readonly threshold = 0.6;

  constructor(
    @InjectRepository(Face)
    private faceRepository: Repository<Face>,
    private userService: UserService,
    private authService: AuthService
  ) { }


  async registerFace(createFaceDto: CreateFaceDto, userId: number): Promise<Face> {
    const { faceDescriptor } = createFaceDto;

    // Kiểm tra xem user đã có đăng ký khuôn mặt chưa
    const existingFace = await this.faceRepository.findOne({ where: { user: { id: userId } } });
    if (existingFace) {
      throw new BadRequestException('Face data already registered for this user');
    }

    // Kiểm tra mảng faceDescriptor
    if (!Array.isArray(faceDescriptor) || faceDescriptor.length === 0) {
      throw new BadRequestException('Invalid face descriptor');
    }

    // Chuyển đổi faceDescriptor thành Buffer
    const faceBuffer = Buffer.from(new Float32Array(faceDescriptor));

    const face = this.faceRepository.create({ user: { id: userId } as User, faceDescriptor: faceBuffer });
    return this.faceRepository.save(face);
  }


  async findByUserId(userId: number): Promise<Face[]> {
    return await this.faceRepository.find({ where: { user: { id: userId } } });
  }

  async loginWithFace(faceDescriptor: number[]): Promise<{ message: string, access_token: string } | { message: string }> {
    const faceDescriptorBuffer = Buffer.from(faceDescriptor);
    const faces = await this.faceRepository.find();
    for (const face of faces) {
      const distance = this.compareFaces(face.faceDescriptor, faceDescriptorBuffer);
      if (distance < this.threshold) {
        const user = await this.userService.getUserById(face.userId);
        if (user) {
          const payload = { sub: face.userId, username: user.username }
          return {
            message: 'Login successful',
            access_token: await this.authService.createToken(payload)
          }
        }
      }
    }
    return { message: 'Face not recognized' };
  }

  compareFaces(descriptor1: Buffer, descriptor2: Buffer): number {
    return this.calculateDistance(descriptor1, descriptor2);
  }

  calculateDistance(descriptor1: Buffer, descriptor2: Buffer): number {
    let sum = 0;
    for (let i = 0; i < descriptor1.length; i++) {
      sum += Math.pow(descriptor1[i] - descriptor2[i], 2);
    }
    return Math.sqrt(sum);
  }


}
