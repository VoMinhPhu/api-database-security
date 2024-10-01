import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { File } from 'src/file/entities/file.entity';
import { Shared } from 'src/shared/entities/shared.entity'; // Import Shared entity

@Entity()
export class Folder {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    // ID của folder cha (nếu có)
    @Column({ nullable: true })
    parentFolderId: number;

    // ID của người sở hữu
    @Column()
    userId: number;

    // Quan hệ nhiều-1 với User
    @ManyToOne(() => User, user => user.folders)
    user: User;

    // Quan hệ 1-nhiều với File
    @OneToMany(() => File, file => file.folder)
    files: File[];

    // Quan hệ 1-nhiều với Shared
    @OneToMany(() => Shared, shared => shared.folder)
    shared: Shared[];

    // Mối quan hệ với folder cha
    @ManyToOne(() => Folder, folder => folder.children, { nullable: true })
    parentFolder: Folder;

    // Mối quan hệ với folder con
    @OneToMany(() => Folder, folder => folder.parentFolder)
    children: Folder[];
}
