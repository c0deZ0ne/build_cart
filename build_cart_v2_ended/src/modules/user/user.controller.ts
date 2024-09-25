import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/modules/auth/user.decorator';
import {
  ActivateUserDto,
  ResetPasswordDto,
  UpdatePasswordDto,
  VerifyEmailDto,
} from './dto';
import { User } from './models/user.model';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Create a new user email',
  })
  async createUser(@Body(ValidationPipe) body: CreateUserDto) {
    return await this.userService.createUser({
      userData: body,
      createdByAdmin: false,
    });
  }

  @Post('register-user-with-sso')
  @ApiOperation({
    summary: 'Create a new user email',
  })
  async createUserWithSSO(@Body(ValidationPipe) body: CreateUserDto) {
    return await this.userService.createUser({
      userData: body,
      sso_user: true,
    });
  }

  @Patch('verify-email')
  @ApiOperation({
    summary: 'Verify email with otp',
  })
  async verifyEmail(@Body(ValidationPipe) body: VerifyEmailDto) {
    return await this.userService.verifyEmail(body);
  }

  @Patch('verify-email-and-create-builder')
  @ApiOperation({
    summary: 'Verify email with otp',
  })
  async verifyEmailAndCreateBuilder(
    @Body(ValidationPipe) body: VerifyEmailDto,
  ) {
    return await this.userService.verifyEmailAndCreateBuilderAndLogin(body);
  }

  @Get('account-details')
  @ApiOperation({
    summary: 'Get User Account details',
  })
  async accountDetails(@Query('email') email: string) {
    return await this.userService.getTestUser(email);
  }

  @Post('request-email-otp/:email')
  @ApiParam({
    name: 'email',
    required: true,
    schema: { type: 'string' },
    example: 'joshua@abc.com',
  })
  @ApiOperation({
    summary: 'Request email otp',
  })
  async requestOtp(@Param() { email }) {
    return await this.userService.requestOtp(email);
  }

  @Patch('reset-password')
  @ApiOperation({
    summary: 'Reset password with otp',
  })
  async resetPassword(@Body(ValidationPipe) body: ResetPasswordDto) {
    await this.userService.resetPassword(body);
  }

  @Post('request-reset-password/:email')
  @ApiParam({
    name: 'email',
    required: true,
    schema: { type: 'string' },
    example: 'joshua@abc.com',
  })
  @ApiOperation({
    summary: 'Request password reset otp',
  })
  async requestResetPassword(@Param() { email }) {
    return await this.userService.requestResetPassword(email);
  }

  @Patch('activate-user')
  @ApiOperation({
    summary: 'Activate team member with otp',
  })
  async activateUser(@Body(ValidationPipe) body: ActivateUserDto) {
    await this.userService.activateUser(body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Change user password',
  })
  @Patch('password')
  async updatePassword(
    @GetUser() { id }: User,
    @Body(ValidationPipe) { oldPassword, newPassword }: UpdatePasswordDto,
  ) {
    await this.userService.userUpdatePassword(id, oldPassword, newPassword);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Update user profile',
  })
  @Patch('profile')
  async updateProfile(
    @GetUser() { id }: User,
    @Body(ValidationPipe) body: UpdateUserDto,
  ) {
    return await this.userService.updateUserProfile(id, body);
  }
}
