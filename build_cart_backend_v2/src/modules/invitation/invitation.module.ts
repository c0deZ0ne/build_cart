import { Module } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { InvitationController } from './invitation.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Invitation } from './models/invitation.model';
import { UserModule } from '../user/user.module';
import { FundManager } from '../fund-manager/models/fundManager.model';
@Module({
  imports: [SequelizeModule.forFeature([Invitation, FundManager]), UserModule],
  exports: [InvitationService],
  providers: [InvitationService],
  controllers: [InvitationController],
})
export class InvitationModule {}
