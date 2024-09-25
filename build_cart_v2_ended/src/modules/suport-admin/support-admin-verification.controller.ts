import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';
import { UserRoles } from '../rbac/models/role.model';
import { SuperAdminVerificationService } from './support-admin-verification.service';
import { GetUser } from '../auth/user.decorator';
import { User } from '../user/models/user.model';
import { DocsResponseDto } from './dto/suport-doc-response.dto';
import { BusinessInfoResponseDto } from './dto/support-businessdetails.dto';

@Controller('supportAdmin')
@ApiTags('support-admin-verification')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class supportAdminVerificationController {
  constructor(
    private readonly superAdminVerificationService: SuperAdminVerificationService,
  ) {}

  @ApiOperation({
    summary: 'fetch all pending verification account',
  })
  @Get('/verification/pending')
  @Roles(UserRoles.SUPER_ADMIN)
  async getPendingVerification(@GetUser()user:User) {
    return await this.superAdminVerificationService.getPendingVerifications({user});
  }
  @ApiOperation({
    summary: 'fetch all ongoing verification account',
  })
  @Get('/verification/ongoing')
  @Roles(UserRoles.SUPER_ADMIN)
  async getOngoingVerification(@GetUser()user:User) {
    return await this.superAdminVerificationService.getOngoingVerifications({user});
  }
  @ApiOperation({
    summary: 'fetch all ongoing verification account',
  })
  @Get('/verification/completed')
  @Roles(UserRoles.SUPER_ADMIN)
  async getCompletedVerification(@GetUser()user:User) {
    return await this.superAdminVerificationService.getCompleteVerifications({user});
  }

  @ApiOkResponse({ type: DocsResponseDto })
  @ApiOperation({
    summary: 'view id verification details docs',
  })
  @Get('/verification/:userId/review')
  @Roles(UserRoles.SUPER_ADMIN)
  async review(@GetUser()user:User,@Param('userId')userId:string) {
    return await this.superAdminVerificationService.reviewUserDoc(userId);
  }

  @ApiOkResponse({ type: BusinessInfoResponseDto })
  @ApiOperation({
    summary: 'view id verification business details ',
  })
  @Get('/verification/:userId/details')
  @Roles(UserRoles.SUPER_ADMIN)
  async businessDetails(@GetUser()user:User,@Param('userId')userId:string) {
    return await this.superAdminVerificationService.businessDetails(userId);
  }

  @ApiOperation({
    summary: 'update customer id verification status  to ongoing',
  })
  @Patch('/verification/:userId/ongoing')
  @Roles(UserRoles.SUPER_ADMIN)
  async moveToOngoing(@GetUser()user:User,@Param('userId')userId:string) {
    return await this.superAdminVerificationService.moveToOngoing(userId);
  }


  @ApiOperation({
    summary: 'update customer id verification status  to completed',
  })
  @Patch('/verification/:userId/complete')
  @Roles(UserRoles.SUPER_ADMIN)
  async moveToCompleted(@GetUser()user:User,@Param('userId')userId:string) {
    return await this.superAdminVerificationService.moveToCompleted(userId);
  }

}
