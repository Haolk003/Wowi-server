import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { TestAuthGuard } from './guards/test-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

describe('AuthController', () => {
  let authController: AuthController;
  let authSerivce: AuthService;

  const mockUser: any = {
    name: 'haolk',
    email: 'haolk005@gmail.com',
    _id: '66ac4f1c158537e76adf653a',
  };
  const token = 'jwtToken';
  const mockAuthSerice = {
    register: jest.fn().mockResolvedValue(mockUser),
    loginUser: jest.fn().mockResolvedValue(token),
    validateUser: jest.fn().mockResolvedValue(mockUser || null),
    getProfileUser: jest.fn().mockResolvedValue(mockUser),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule],
      controllers: [AuthController],
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: mockAuthSerice,
        },
      ],
    })
      .overrideGuard(LocalAuthGuard)
      .useClass(TestAuthGuard)
      .overrideGuard(JwtAuthGuard)
      .useClass(TestAuthGuard)
      .compile();
    authController = module.get<AuthController>(AuthController);
    authSerivce = module.get<AuthService>(AuthService);
  });

  describe('signUp', () => {
    it('should return token on success login', async () => {
      const req = { user: { _id: 12, email: 'haolk003@gmail.com' } };

      const result = await authController.login(req as any);
      expect(result).toEqual(token);
    });

    it('should throw UnauthorizedException on failed login', async () => {
      jest.spyOn(authSerivce, 'validateUser').mockResolvedValue(null);
      try {
        await authController.login({
          body: { username: 'haolk003@gmail.com', password: '123456' },
        });
      } catch (error) {
        expect(error.status).toBe(401);
      }
    });
  });

  describe('signUp', () => {
    it('should register a new user ', async () => {
      const signUpDto = {
        email: 'haolk003@gmail.com',
        name: 'hao',
        password: '123456',
      };

      const result = await authController.register(signUpDto);

      expect(authSerivce.register).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
  });

  describe('getProfile', () => {
    it('should return the user profile', async () => {
      const req = { user: { userId: mockUser._id } };
      const result = await authController.getProfile(req as any);
      expect(result).toEqual(mockUser);
    });
  });
});
