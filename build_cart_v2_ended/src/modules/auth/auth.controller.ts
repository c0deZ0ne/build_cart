import {
  Controller,
  Request,
  Post,
  UseGuards,
  HttpCode,
  ValidationPipe,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginDto, LoginWithSSODto } from './dto/login.dto';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { UserWalletService } from '../user-wallet/user-wallet.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userWalletService: UserWalletService,
  ) {}

  @ApiBody({ type: LoginDto })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Request() req) {
    await this.userWalletService.genWalletForUser(req.user);
    return this.authService.login(req.user);
  }

  @ApiBody({ type: LoginWithSSODto })
  @Post('login-with-sso')
  async loginWithSSO(@Body(ValidationPipe) data: LoginWithSSODto) {
    return this.authService.loginWithSSO(data.email);
  }
}
