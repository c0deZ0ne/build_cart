import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SponsorGuard } from 'src/modules/auth/guards/fundManager.guard';
import { GetUser } from 'src/modules/auth/user.decorator';
import { User } from 'src/modules/user/models/user.model';
import { SponsorWalletService } from './fundManager-wallet.services';
import { FundWalletDto } from './dto/fundManager-fundwallet.dto';
import { FundProjectWalletDto } from './dto/fundproject.dto';

@Controller('fundManager')
@ApiTags('fundManager')
@ApiBearerAuth()
@UseGuards(SponsorGuard)
export class SponsorWalletController {
  constructor(
    private readonly fundManagerWalletService: SponsorWalletService,
  ) {}

  @ApiOperation({
    summary: 'fund account',
  })
  @Post('fund-account/')
  async fundWallet(
    @GetUser() user: User,
    @Body(ValidationPipe) body: FundWalletDto,
  ) {
    await this.fundManagerWalletService.SponsorfundWallet({
      data: body,
      user,
    });
  }

  @ApiOperation({
    summary: 'fund project wallet',
  })
  @Post('fund-project-wallet')
  async fundProjectWallet(
    @GetUser() user: User,
    @Body(ValidationPipe) body: FundProjectWalletDto,
  ) {
    return await this.fundManagerWalletService.fundProjectWallet(body, user);
  }
}
