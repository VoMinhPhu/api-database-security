import { IsNotEmpty } from 'class-validator';

export class CreateFaceDto {
    @IsNotEmpty()
    userId: number; // ID của người dùng

    @IsNotEmpty()
    faceDescriptor: Buffer; // Mô tả khuôn mặt
}
