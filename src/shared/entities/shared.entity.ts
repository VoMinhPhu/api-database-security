import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { File } from 'src/file/entities/file.entity';
import { Folder } from 'src/folder/entities/folder.entity';

@Entity()
export class Shared {
    @PrimaryGeneratedColumn()
    id: number;  // ID tự động tăng

    @Column()
    permission: string;  // Quyền chia sẻ

    @Column()
    ownerId: number;  // ID của người sở hữu

    @Column()
    recipientId: number;  // ID của người nhận

    @Column({ nullable: true })
    fileId: number;  // ID của file (nếu có)

    @Column({ nullable: true })
    folderId: number;  // ID của folder (nếu có)

    @Column()
    status: string;  // Trạng thái chia sẻ

    // Mối quan hệ với User (chủ sở hữu)
    @ManyToOne(() => User, (user) => user.shared, { onDelete: 'CASCADE' })
    owner: User;

    // Mối quan hệ với User (người nhận)
    @ManyToOne(() => User, (user) => user.shared, { onDelete: 'CASCADE' })
    recipient: User;

    // Mối quan hệ với File
    @ManyToOne(() => File, (file) => file.shared, { onDelete: 'CASCADE', nullable: true })
    file: File;

    // Mối quan hệ với Folder
    @ManyToOne(() => Folder, (folder) => folder.shared, { onDelete: 'CASCADE', nullable: true })
    folder: Folder;
}
