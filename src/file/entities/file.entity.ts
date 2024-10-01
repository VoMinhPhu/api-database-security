import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Folder } from 'src/folder/entities/folder.entity';
import { Shared } from 'src/shared/entities/shared.entity'; // Import Shared entity

@Entity()
export class File {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    content: string;

    @Column()
    type: string;

    @Column()
    userId: number; // ID của người sở hữu

    @Column({ nullable: true })
    folderId: number; // ID của folder (nếu có)

    // Quan hệ nhiều-1 với User
    @ManyToOne(() => User, user => user.files)
    user: User;

    // Quan hệ nhiều-1 với Folder (nếu có)
    @ManyToOne(() => Folder, folder => folder.files, { nullable: true })
    folder: Folder;

    // Quan hệ 1-nhiều với Shared
    @OneToMany(() => Shared, shared => shared.file, { nullable: true })
    shared: Shared[];
}
