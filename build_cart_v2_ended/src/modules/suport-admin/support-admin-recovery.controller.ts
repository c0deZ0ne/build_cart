import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';
import { UserRoles } from '../rbac/models/role.model';
import { GetUser } from '../auth/user.decorator';
import { User } from '../user/models/user.model';
import { SupportAdminRecoveryService } from './support-admin-recovery.service';
import { UpdateEmailDto } from './dto/security-update.dto';
import { RecoveryResponseDto } from './dto/suport-response.dto';

@Controller('support-recovery')
@ApiTags('support-admin-recovery')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class supportAdminRecoveryController {
  constructor(
    private readonly supportAdminRecoveryService: SupportAdminRecoveryService,
  ) {}

  @ApiOkResponse({ type: RecoveryResponseDto })
  @ApiOperation({
    summary: 'fetch all account recovery request',
  })
  @Get('/all/request')
  @Roles(UserRoles.SUPER_ADMIN)
  async getPendingRecovery(@GetUser()user:User) {
    return await this.supportAdminRecoveryService.getAllAccountRecoveryRequest({user});
  }
  @ApiOperation({
    summary: 'update user email',
  })
  @Patch('/:customerId/update')
  @Roles(UserRoles.SUPER_ADMIN)
  async updateUserEmail( @GetUser()user:User,@Body()body:UpdateEmailDto ,@Param("customerId")customerId:string) {
    return await this.supportAdminRecoveryService.updateUserEmail({user,customerId,body});
  }

}
