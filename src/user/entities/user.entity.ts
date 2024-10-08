import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne } from 'typeorm';
import { File } from 'src/file/entities/file.entity';
import { Folder } from 'src/folder/entities/folder.entity';
import { Shared } from 'src/shared/entities/shared.entity'; // Import Shared entity
import { Face } from 'src/face/entities/face.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    fullname: string;

    @Column()
    phone: string;

    @Column()
    address: string;

    @Column()
    otp: string

    @Column({ default: false })
    isVerified: boolean

    // Quan hệ 1-nhiều với File
    @OneToMany(() => File, file => file.user)
    files: File[];

    // Quan hệ 1-nhiều với Folder
    @OneToMany(() => Folder, folder => folder.user)
    folders: Folder[];

    // Quan hệ 1-nhiều với Shared
    @OneToMany(() => Shared, shared => shared.owner)
    shared: Shared[];

    // Quan hệ 1-1 với Face
    @OneToOne(() => Face, face => face.user)
    face: Face;
}
