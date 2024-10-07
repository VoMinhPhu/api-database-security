import { IsNotEmpty } from 'class-validator';

export class LoginFaceDto {
    @IsNotEmpty()
    faceDescriptor: number[];  // Dùng Buffer để lưu trữ kiểu dữ liệu BLOB
}
