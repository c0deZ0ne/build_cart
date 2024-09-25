import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/modules/user/user.service';
import { ContractService } from 'src/modules/contract/contract.service';
import { RateReviewService } from 'src/modules/rate-review/rate-review.service';
import { BankService } from 'src/modules/bank/bank.service';
import { VendorService } from 'src/modules/vendor/vendor.service';
import { BuilderService } from 'src/modules/builder/builder.service';
import { AdminUpdatePasswordDto } from 'src/modules/user/dto/admin-update-password.dto';
import { AdminUpdateBuilderProfileDto } from '../builder/dto';

@Controller('admin')
@ApiTags('admin')
@ApiBearerAuth()
// @UseGuards(AdminGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly contractService: ContractService,
    private readonly rateReviewVendorService: RateReviewService,
    private readonly bankService: BankService,
    private readonly vendorService: VendorService,
    private readonly buyerService: BuilderService,
  ) {}

  @ApiOperation({
    summary: 'Retrieve all users',
  })
  @Get('/user')
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  @ApiOperation({
    summary: 'delete a user',
  })
  @Delete('/:userId/delete')
  async deleteUser(@Param('userId') userId: string) {
    return await this.userService.deleteUser(userId);
  }

  @ApiOperation({
    summary: 'Retrieve user details by id',
  })
  @Get('/user/:id')
  async getUserById(@Param('id') userId: string) {
    const user = await this.userService.getUserById(userId);
    const contracts = await this.contractService.getAllContractsForUser(user);
    const rateReviews = await this.rateReviewVendorService.getVendorRateReviews(
      user,
    );
    const bank = user.VendorId
      ? await this.bankService.getBankDetails(user.VendorId)
      : null;
    return { user, contracts, rateReviews, bank };
  }

  @ApiOperation({
    summary: 'Change user password',
  })
  @Patch('/user/:id/password')
  async updateUserPassword(
    @Param('id') userId: string,
    @Body(ValidationPipe) { password }: AdminUpdatePasswordDto,
  ) {
    await this.userService.updatePassword(userId, password);
  }

  @ApiOperation({
    summary: 'Update builder details',
  })
  @Patch('/user/builder/:builderId')
  async updateBuilderDetails(
    @Body(ValidationPipe) body: AdminUpdateBuilderProfileDto,
    @Param('builderId') builderId: string,
  ) {
    await this.buyerService.adminUpdateProfile(builderId, body);
  }

  @ApiOperation({
    summary: 'activate user account ',
  })
  @Patch('/user/:id/activate')
  async adminactivateUser(@Param('id') userid: string) {
    return await this.userService.adminActivate(userid);
  }
  @ApiOperation({
    summary: 'deactivate user account ',
  })
  @Patch('/user/:id/deactivate')
  async adminDeactivateUser(@Param('id') userid: string) {
    return await this.userService.adminDeactivate(userid);
  }
}
