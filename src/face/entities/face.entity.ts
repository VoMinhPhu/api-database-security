import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Face {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number; // ID của người dùng

    @Column({ type: 'blob' })
    faceDescriptor: Buffer; // Mô tả khuôn mặt

    // Quan hệ 1-1 với User
    @OneToOne(() => User, user => user.face)
    @JoinColumn({ name: 'userId' }) // Tên trường khóa ngoại trong bảng Face
    user: User;
}
