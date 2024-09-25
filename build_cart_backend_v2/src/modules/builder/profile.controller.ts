import {
  Body,
  Controller,
  Get,
  Patch,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BuilderGuard } from 'src/modules/auth/guards/builder.guard';
import { GetUser } from 'src/modules/auth/user.decorator';
import { User } from 'src/modules/user/models/user.model';
import { UserService } from 'src/modules/user/user.service';
import { BuilderService } from './builder.service';
import { SecurityUpdateDTO } from '../user/dto/user-security.dto';
import { UpdateBuilderProfileDto } from './dto/update-builder-profile.dto';
import { BankService } from '../bank/bank.service';
import { UseSubscription } from '../platfrom-subscription/platform-subscription.decorator';

@Controller('builder')
@ApiTags('builder')
@ApiBearerAuth()
  @UseGuards(BuilderGuard)
    @UseSubscription()

export class ProfileController {
  constructor(
    private readonly userService: UserService,
    private readonly buyerService: BuilderService,
    private readonly bankService: BankService,
  ) {}

  @ApiOperation({
    summary: 'Get builder profile details',
  })
  @Get('profile/')
  async getBuilderById(@GetUser() { BuilderId }: User) {
    const builderProfile = await this.buyerService.getBuilderById(BuilderId);
    const bankDetails = await this.bankService.getBuilderBankDetails(BuilderId);
    return { builderProfile, bankDetails };
  }

  @ApiOperation({
    summary: 'update your security details',
  })
  @Patch('account/security-update')
  async securityUpdate(
    @GetUser() user: User,
    @Body(ValidationPipe) securityUpdateDto: SecurityUpdateDTO,
  ) {
    return this.userService.securityUpdate({ user, securityUpdateDto });
  }

  @ApiOperation({
    summary: 'Get user details',
  })
  @Get('account/security')
  async getUserDetails(@GetUser() { id }: User) {
    const {
      status,
      email,
      twoFactorAuthEnabled,
      emailNotificationEnabled,
      smsNotificationEnabled,
      signatures,
    } = await this.userService.getUserById(id);
    return {
      status,
      id,
      email,
      smsNotificationEnabled,
      signatures,
      twoFactorAuthEnabled,
      emailNotificationEnabled,
    };
  }

  @ApiOperation({
    summary: 'Update builder profile',
  })
  @Patch('profile')
  async updateProfile(
    @GetUser() { BuilderId }: User,
    @Body(ValidationPipe)
    body: UpdateBuilderProfileDto,
  ) {
    return await this.buyerService.updateProfile(BuilderId, body);
  }
}
