import {
  BadGatewayException,
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { GetUser } from '../auth/user.decorator';
import { User } from '../user/models/user.model';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { PaystackWebhookEnum, PaystackWebhookRequest } from './types';
import {
  fundProjectWalletByVaultDto,
  fundProjectWalletDto,
} from '../project-wallet/dto/contract-wallet-pay.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('projects')
@ApiTags('project-wallet')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation({
    summary: 'Fundmanager fund project wallet from his vault',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':projectId/vault')
  async fundProjectWalletByVault(
    @Body(ValidationPipe) body: fundProjectWalletByVaultDto,
    @Param('projectId') projectId: string,
    @GetUser() user: User,
  ) {
    return await this.projectService.fundProjectWalletFromUserVault(
      projectId,
      body.amount,
      user,
    );
  }

  @ApiOperation({
    summary: 'initaiate project wallet funding by paystack',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('/paystack/initiate-transactions')
  async fundProjectWalletByPaystack(
    @Body(ValidationPipe) body: fundProjectWalletDto,
    @GetUser() user: User,
  ) {
    return await this.projectService.fundProjectWalletByPaystack(body, user);
  }

  @ApiOperation({
    summary: 'Paystack webhook verification',
  })
  @Post('paystack/verify-transactions')
  async verifyPaystackProjectWalletPayment(
    @Headers() headers,
    @Body(ValidationPipe) body: unknown,
  ) {
    const secret = this.configService.get('PAYSTACK_SECRET');
    const hash = crypto
      .createHmac('sha512', secret)
      .update(JSON.stringify(body))
      .digest('hex');
    if (hash !== headers['x-paystack-signature'])
      throw new UnauthorizedException('unauthorized');
    const { event, data } = body as PaystackWebhookRequest;

    if (event === PaystackWebhookEnum.CHARGE_SUCCESS) {
      return await this.projectService.verifyPaystackPayment(data);
    } else {
      throw new BadGatewayException();
    }
  }

  @ApiOperation({
    summary: 'Get project wallet',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('wallet/:projectId')
  async getProjectWallet(@Param('projectId') projectId: string) {
    return await this.projectService.getProjectWallet(projectId);
  }
}
