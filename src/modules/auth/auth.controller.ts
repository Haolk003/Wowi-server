import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signUp.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { LoginResponseDto, SignInDto } from './dto/signIn.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: SignUpDto })
  @ApiResponse({ status: 201, type: User })
  register(@Body() signUpDto: SignUpDto) {
    return this.authService.register(signUpDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'login user by password' })
  @ApiBody({ type: SignInDto })
  @ApiResponse({ status: 201, type: LoginResponseDto })
  async login(@Request() req: any) {
    const result = await this.authService.loginUser(req.user);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Get Profile User' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: User })
  async getProfile(@Request() req: any) {
    const user = await this.authService.getProfileUser(req.user.userId);
    return user;
  }
}
