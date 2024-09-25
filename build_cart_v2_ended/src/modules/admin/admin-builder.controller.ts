import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/modules/auth/guards/admin.guard';
import { GetUser } from '../auth/user.decorator';
import { User } from '../user/models/user.model';
import { UserService } from '../user/user.service';
import { BuilderService } from '../builder/builder.service';
import { CreateBuilderDto } from '../builder/dto/register-builder.dto';
import { AdminBuilderService } from './admin-builder.services';
import { AdminCreateBuilderDto } from './dto/admin-create-buyer.dto';

@Controller('admin')
@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(AdminGuard)
export class AdminBuilderController {
  constructor(private readonly adminBuilderService: AdminBuilderService) {}

  @ApiOperation({
    summary: 'Return all buyers',
  })
  @Get('/buyers')
  async getAllUsers() {
    return await this.adminBuilderService.adminGetAllBuilders();
  }

  @ApiOperation({
    summary: 'Register a Builder',
  })
  @Post('/builder')
  async registerBuilder(
    @Body(ValidationPipe) body: AdminCreateBuilderDto,
    @GetUser() user: User,
  ) {
    return await this.adminBuilderService.AdminRegisterBuilder({ body, user });
  }

  @ApiOperation({
    summary: 'approve a Builder for credit ',
  })
  @Patch('/builder/:builderId/enable')
  async approveCredit(
    @GetUser() admin: User,
    @Param('builderId') builderId: string,
  ) {
    return await this.adminBuilderService.enableCredit({ builderId, admin });
  }

  @ApiOperation({
    summary: 'disable a Builder for credit ',
  })
  @Patch('/builder/:builderId/disable')
  async disableCredit(
    @GetUser() admin: User,
    @Param('builderId') builderId: string,
  ) {
    return await this.adminBuilderService.disableCredit({ builderId, admin });
  }

  @ApiOperation({
    summary: 'activate user account ',
  })
  @Patch('/builder/:userId/activate')
  async adminActivateUser(@Param('userId') userId: string) {
    return await this.adminBuilderService.adminActivate(userId);
  }
  @ApiOperation({
    summary: 'deactivate user account ',
  })
  @Patch('/builder/:userId/deactivate')
  async adminDeactivateUser(@Param('userId') userId: string) {
    return await this.adminBuilderService.adminDeactivate(userId);
  }
}
