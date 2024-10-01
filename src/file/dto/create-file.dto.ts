import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateFileDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsNotEmpty()
    @IsString()
    type: string;

    @IsNotEmpty()
    userId: number;  // Liên kết với user

    @IsOptional()
    folderId?: number;  // Có thể không có nếu file nằm ở thư mục gốc
}
