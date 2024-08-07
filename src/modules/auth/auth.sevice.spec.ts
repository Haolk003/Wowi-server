import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './schema/user.schema';

import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;

  let model: Model<User>;

  let jwtService: JwtService;

  const mockAuthServivce = {
    create: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
  };

  const mockUser: any = {
    name: 'haolk',
    email: 'haolk005@gmail.com',
    _id: '66ac4f1c158537e76adf653a',
  };
  const token = 'haolk003';
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        { provide: getModelToken(User.name), useValue: mockAuthServivce },
      ],
      controllers: [AuthController],
    }).compile();
    authService = module.get<AuthService>(AuthService);
    model = module.get<Model<User>>(getModelToken(User.name));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signUp', () => {
    const signUpDto = { email: 'haolk@003', name: 'hao', password: '123456' };

    it('should sign up the new user', async () => {
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve('hashedPassword'));
      jest
        .spyOn(model, 'create')
        .mockImplementationOnce(() => Promise.resolve(mockUser));

      const result = await authService.register(signUpDto);
      expect(bcrypt.hash).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('Should throw duplicate email entered', async () => {
      jest
        .spyOn(model, 'create')
        .mockImplementationOnce(() => Promise.reject({ code: 11000 }));
      await expect(authService.register(signUpDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('signIn', () => {
    it('should sign in and return a token', async () => {
      const signInDto = {
        email: 'haolk003@gmail.com',
        sub: '66ac4f1c158537e76adf653a',
      };
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);
      const result = await authService.loginUser(signInDto);
      expect(result).toEqual({
        token,
        user: signInDto,
      });
    });
  });

  describe('validate-user', () => {
    const signInDto = {
      email: 'haolk003@gmail.com',
      password: '123456',
    };
    const { email, password } = signInDto;

    it('should validate user ', async () => {
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementationOnce(() => Promise.resolve(true));

      jest.spyOn(model, 'findOne').mockResolvedValue(mockUser);
      const result = await authService.validateUser(email, password);
      expect(result).toEqual(mockUser);
    });

    it('should throw invalid email error', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValue(null);
      const result = await authService.validateUser(email, password);
      expect(result).toBeNull();
    });

    it('should throw invalid password error', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValueOnce(mockUser);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementationOnce(() => Promise.resolve(false));

      const result = await authService.validateUser(email, password);

      expect(result).toBeNull();
    });
  });

  describe('get-profile', () => {
    it('should return a user profile', async () => {
      jest.spyOn(model, 'findById').mockResolvedValueOnce(mockUser);

      const result = await authService.getProfileUser(mockUser._id);

      expect(result).toEqual(mockUser);
    });

    it('should throw a NotFoundException if user not found', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(null);

      await expect(authService.getProfileUser(mockUser._id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
