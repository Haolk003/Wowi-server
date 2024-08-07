import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import mongoose from 'mongoose';
import { SignUpDto } from './dto/signUp.dto';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: mongoose.Model<User>,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      return null;
    }
    const isEqualPassword = await bcrypt.compare(password, user.password);
    if (!isEqualPassword) {
      return null;
    }

    return user;
  }

  async register(signUpDto: SignUpDto): Promise<any> {
    try {
      const { name, email, password } = signUpDto;

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.userModel.create({
        name,
        email,
        password: hashedPassword,
      });

      return user;
    } catch (error) {
      if (error?.code === 11000) {
        throw new ConflictException('Duplicate Email Entered');
      }
    }
  }

  async loginUser(user: any): Promise<{ token: string; user: any }> {
    const payload = { email: user.email, sub: user._id };
    const token = this.jwtService.sign(payload);
    return { token, user };
  }

  async getProfileUser(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
