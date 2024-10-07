import { IsNotEmpty } from 'class-validator';

export class CreateFaceDto {
    @IsNotEmpty()
    faceDescriptor: Buffer; // Mô tả khuôn mặt
}
