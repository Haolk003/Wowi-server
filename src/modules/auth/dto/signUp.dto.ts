import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString, MinLength } from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    description: 'Full name',
    example: 'Nguyen Van A',
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    description: 'User password',
    example: 'strongPassword123',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;
}
