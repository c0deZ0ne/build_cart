import { Injectable } from '@nestjs/common';
import { User } from '../user/models/user.model';
import { SupportAdminRecoveryService } from './support-admin-recovery.service';
import { SuperAdminVerificationService } from './support-admin-verification.service';
import { SupportAdminDisputeService } from './support-admin-dispute.service';
import { Dispute } from '../dispute/models/dispute.model';
import { UserLogService } from '../user-log/user-log.service';

@Injectable()
export class SupportAdminService {
  constructor(
    private recovery: SupportAdminRecoveryService,
    private disputeService: SupportAdminDisputeService,
    private idVerification: SuperAdminVerificationService,
    private userLogService: UserLogService,
  ) {}
  async supportAdminStatistics({
    user,
    startDate,
    endDate,
  }: {
    user: User;
    startDate?: string;
    endDate?: string;
  }) {
    try {
      let disputes: Dispute[] = await this.disputeService.getAllDisputes();

      if (startDate && endDate) {
        disputes = disputes.filter(
          (dispute) =>
            dispute.createdAt >= new Date(startDate) &&
            dispute.createdAt <= new Date(endDate),
        );
      }

      const disputeTrend = new Array(12).fill(0);
      const currentYear = new Date().getFullYear();

      disputes?.forEach((dispute: Dispute) => {
        const monthIndex = dispute.createdAt.getMonth();
        if (dispute.createdAt.getFullYear() === currentYear) {
          disputeTrend[monthIndex] += 1;
        }
      });

      const refunds = await this.disputeService.getAllDisputes();
      const recovery = await this.recovery.getAllAccountRecoveryRequest({});
      const verification = await this.idVerification.getPendingVerifications(
        {},
      );
      await this.userLogService.createLog({
        teamMemberId: user.id,
        activityDescription: `access account statistics at ${new Date()}`,
        activityTitle: 'accessed statistics',
      });
      const logs = await this.userLogService.getUserLogs(user);
      return {
        totalDisputes: refunds.length,
        totalRecovery: recovery.length,
        IdVerification: verification.length,
        disputeTrend,
        activityLogs: logs,
      };
    } catch (error) {
      throw error;
    }
  }
}
