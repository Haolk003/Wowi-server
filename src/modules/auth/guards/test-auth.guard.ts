// src/auth/test-auth.guard.ts
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class TestAuthGuard extends AuthGuard('local') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    request.user = { userId: 1, username: 'test' }; // Mock user
    return true;
  }
}
