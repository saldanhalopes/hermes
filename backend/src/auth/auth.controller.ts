import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignupDto } from './auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Registrar um novo usuário com tenant e role' })
  async signup(@Body() dto: SignupDto) {
    return this.authService.registerUser(dto.email, dto.password, dto.tenantId, dto.role);
  }
}
