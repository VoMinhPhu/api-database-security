import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Face } from './entities/face.entity';
import { CreateFaceDto } from './dto/create-face.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class FaceService {
  private readonly threshold = 0.5;

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
    const faceBuffer = Buffer.from(new Float32Array(faceDescriptor).buffer);

    const face = this.faceRepository.create({ user: { id: userId } as User, faceDescriptor: faceBuffer });
    return this.faceRepository.save(face);
  }


  async findByUserId(userId: number): Promise<Face[]> {
    return await this.faceRepository.find({ where: { user: { id: userId } } });
  }

  async loginWithFace(faceDescriptor: number[]): Promise<{ message: string, access_token: string } | { message: string }> {
    const faceDescriptorBuffer = Buffer.from(new Float32Array(faceDescriptor).buffer);
    const faces = await this.faceRepository.find();
    const lstId = []
    const lstDistance = []
    for (const face of faces) {
      const distance = this.compareFaces(face.faceDescriptor, faceDescriptorBuffer);
      if (distance < this.threshold) {
        lstDistance.push(distance)
        lstId.push(face.userId)
      }
    }
    if (lstDistance.length != 0) {
      const minDistance = Math.min(...lstDistance)
      const minIndex = lstDistance.indexOf(minDistance)
      const user = await this.userService.getUserById(lstId[minIndex]);
      const payload = { sub: minDistance, username: user.username }
      return {
        message: 'Login successful',
        access_token: await this.authService.createToken(payload)
      }
    }

    return { message: 'Face not recognized' }
  }

  compareFaces(descriptor1: Buffer, descriptor2: Buffer): number {
    return this.calculateDistance(descriptor1, descriptor2);
  }

  calculateDistance(descriptor1: Buffer, descriptor2: Buffer): number {
    let sum = 0;

    // Chuyển đổi Buffer thành Float32Array
    const arr1 = new Float32Array(descriptor1.buffer, descriptor1.byteOffset, descriptor1.length / 4);
    const arr2 = new Float32Array(descriptor2.buffer, descriptor2.byteOffset, descriptor2.length / 4);

    for (let i = 0; i < arr1.length; i++) {
      sum += Math.pow(arr1[i] - arr2[i], 2);
    }
    return Math.sqrt(sum);
  }




}
