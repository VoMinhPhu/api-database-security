import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateSharedDto {
    @IsNotEmpty()
    @IsString()
    permission: string;

    @IsNotEmpty()
    ownerId: number;

    @IsNotEmpty()
    recipientId: number;

    @IsOptional()
    fileId?: number;

    @IsOptional()
    folderId?: number;

    @IsNotEmpty()
    @IsString()
    status: string;
}
