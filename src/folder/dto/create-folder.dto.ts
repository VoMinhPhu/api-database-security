import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateFolderDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    userId: number;  // Liên kết với user

    @IsOptional()
    parentFolderId?: number;  // Thư mục cha có thể không tồn tại 
}
