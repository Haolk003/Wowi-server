import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString, MinLength } from 'class-validator';
import { User } from '../entities/user.entity';

export class SignInDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  readonly username: string;

  @ApiProperty({
    description: 'User password',
    example: 'strongPassword123',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'JWT token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  token: string;

  @ApiProperty({
    description: 'User details',
    type: User,
  })
  user: any;
}
