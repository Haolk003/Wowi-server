import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    example: '66ac4f1c158537e76adf6231',
    description: 'The unique identifier of the user.',
  })
  _id: number;

  @Column({ length: 100 })
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user.',
  })
  email: string;

  @Column({ length: 100 })
  @ApiProperty({ example: 'John Doe', description: 'The name of the user.' })
  name: string;

  @Column()
  @ApiProperty({
    example: 'hashedpassword',
    description: 'The hashed password of the user.',
  })
  password: string;

  @CreateDateColumn()
  @ApiProperty({
    example: '2023-08-02T12:34:56.789Z',
    description: 'The date when the user was created.',
  })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({
    example: '2023-08-02T12:34:56.789Z',
    description: 'The date when the user was last updated.',
  })
  updatedAt: Date;
}
