import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { BankService } from './bank.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResolveAccountDto } from './dto/resolve-account.dto';

@Controller('bank')
@ApiTags('bank')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @ApiOperation({
    summary: 'Retrieves all supported banks',
  })
  @Get('')
  async getAllBanks() {
    return this.bankService.getAllBanks();
  }

  @ApiOperation({
    summary: 'Resolve an account',
  })
  @Post('resolve')
  async resolveBank(@Body(ValidationPipe) body: ResolveAccountDto) {
    return await this.bankService.resolveBank({ ...body });
  }
}
