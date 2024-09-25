import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/modules/auth/user.decorator';
import { User } from 'src/modules/user/models/user.model';
import { BuilderWalletService } from './builder-wallet.service';
import { BuilderGuard } from '../auth/guards/builder.guard';
import { FundWalletDto } from '../fund-manager/dto/fundManager-fundwallet.dto';

@Controller('builder')
@ApiTags('builder')
@ApiBearerAuth()
@UseGuards(BuilderGuard)
export class BuilderWalletController {
  constructor(private readonly buyerWalletService: BuilderWalletService) {}

  @ApiOperation({
    summary: 'fund account',
  })
  @Post('fund-account/')
  async fundWallet(
    @GetUser() user: User,
    @Body(ValidationPipe) body: FundWalletDto,
  ) {
    await this.buyerWalletService.buyerFundWallet({
      data: body,
      user,
    });
  }
}
