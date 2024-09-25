import { Injectable } from '@nestjs/common';
import { ContractPaymentStatus, ContractStatus } from '../contract/models';
import { ContractService } from '../contract/contract.service';
import { BuilderService } from '../builder/builder.service';
import { DisputeService } from '../dispute/dispute.service';
import { DisputeStatus } from '../dispute/models/dispute.model';
import { VendorService } from '../vendor/vendor.service';
import { User } from '../user/models/user.model';
import * as moment from 'moment';
import { Vendor } from '../vendor/models/vendor.model';
import { RfqCategory } from '../rfq/models';
import { bestCat } from '../builder/types';

@Injectable()
export class AdminService {
  constructor(
    private contractService: ContractService,
    private vendorService: VendorService,
    private buyerService: BuilderService,
    private disputeService: DisputeService,
  ) {}
  async adminStatistics(user: User) {
    let overallPayment = 0;
    let overallWithdrawal = 0;
    let paymentPerMonth = 0;
    let paymentPerWeek = 0;
    let withdrawalPerMonth = 0;
    let withdrawalPerWeek = 0;
    let overallRefund = 0;
    let overallRefundPerMonth = 0;
    let overallRefundPerWeek = 0;
    let totalIndividualBuilders = 0;
    let totalCorporateBuilders = 0;
    let totalVendors = 0;
    let contractComplete = 0;
    let contractInProgress = 0;
    let overallBalance = 0;
    let overallBalancePerMonth = 0;
    let overallBalancePerWeek = 0;
    let totalOrders = 0;
    let ongoingOrders = 0;
    let completedOrders = 0;
    const topMaterialCategory: RfqCategory[] = [];

    const isIndividualBuilderTrendPerMonth = new Array(12).fill(0);
    const isCorporateBuilderTrendPerMonth = new Array(12).fill(0);
    const isVendorTrendPerMonth = new Array(12).fill(0);

    const currentYear = new Date().getFullYear();
    const currentDate = moment();
    const startDate = currentDate.startOf('week').toDate();
    const endDate = currentDate.endOf('week').toDate();
    const contracts = await this.contractService.getContracts();

    contracts.forEach((contract) => {
      totalOrders += 1;
      topMaterialCategory.push(
        contract?.RfqQuote?.RfqRequestMaterial?.category,
      );
      if (
        contract.status == ContractStatus.PENDING ||
        contract.status == ContractStatus.CANCELLED
      ) {
        ongoingOrders += 1;
      } else if (contract.status == ContractStatus.COMPLETED) {
        completedOrders += 1;
      }
      const monthIndex = contract.createdAt.getMonth();
      const createdAt = moment(contract.createdAt);
      const weeklyCheck = createdAt.isBetween(
        startDate,
        endDate,
        undefined,
        '[]',
      );
      const totalCost = Number(contract.totalCost);
      const fee = Number(contract.fee);

      if (contract.paymentStatus === ContractPaymentStatus.CONFIRMED) {
        overallPayment += totalCost;

        if (
          contract.createdAt.getFullYear() === currentYear &&
          contract.createdAt.getMonth() === monthIndex
        ) {
          paymentPerMonth += totalCost;
        }
        if (weeklyCheck) {
          paymentPerWeek += totalCost;
        }
      }

      if (contract.isDisbursed === true) {
        overallWithdrawal += totalCost - fee;
        if (
          contract.createdAt.getFullYear() === currentYear &&
          contract.createdAt.getMonth() === monthIndex
        ) {
          withdrawalPerMonth += totalCost - fee;
        }
        if (weeklyCheck) {
          withdrawalPerWeek += totalCost - fee;
        }
      }

      if (contract.status === ContractStatus.COMPLETED) {
        contractComplete += 1;
      }

      if (
        contract.status === ContractStatus.ACCEPTED ||
        contract.status === ContractStatus.PENDING
      ) {
        contractInProgress += 1;
      }
    });

    const vendors: Vendor[] = await this.vendorService.fetchVendors();
    vendors?.forEach((vendor: Vendor) => {
      const monthIndex = vendor.createdAt.getMonth();
      totalVendors += 1;

      if (vendor.createdAt.getFullYear() === currentYear) {
        isVendorTrendPerMonth[monthIndex] += 1;
      }
    });

    const buyers = await this.buyerService.getAllBuilder();
    buyers.forEach((builder) => {
      const monthIndex = builder.createdAt.getMonth();
      if (builder.isIndividual === true) {
        totalIndividualBuilders += 1;
        if (builder.createdAt.getFullYear() === currentYear) {
          isIndividualBuilderTrendPerMonth[monthIndex] += 1;
        }
      }
      if (builder.isIndividual === false) {
        totalCorporateBuilders += 1;
        if (builder.createdAt.getFullYear() === currentYear) {
          isCorporateBuilderTrendPerMonth[monthIndex] += 1;
        }
      }
    });

    const refunds = await this.disputeService.getAllDisputes(true);

    refunds
      .filter((refund) => refund.status === DisputeStatus.REFUNDED)
      .forEach((refund) => {
        const monthIndex = refund.refundedAt.getMonth();
        const refundedAt = moment(refund.refundedAt);
        const weeklyCheck = refundedAt.isBetween(
          startDate,
          endDate,
          undefined,
          '[]',
        );
        const totalCost = Number(refund.Contract.totalCost);

        overallRefund += totalCost;
        if (
          refund.refundedAt.getFullYear() === currentYear &&
          refund.refundedAt.getMonth() === monthIndex
        ) {
          overallRefundPerMonth += totalCost;
        }

        if (weeklyCheck) {
          overallRefundPerWeek += totalCost;
        }
      });

    overallBalance += overallPayment - overallWithdrawal - overallRefund;

    overallBalancePerMonth +=
      paymentPerMonth - withdrawalPerMonth - overallRefundPerMonth;

    overallBalancePerWeek +=
      paymentPerWeek - withdrawalPerWeek - overallRefundPerWeek;

    const topCat: bestCat[] = topMaterialCategory.reduce(
      (pre: bestCat[], current: RfqCategory) => {
        const data = pre.find((d: bestCat) => d.id == current.id);
        if (!data) {
          pre.push({
            id: current.id,
            title: current.title,
            total: 1,
          });
        } else {
          data.total += 1;
        }
        return pre.sort((a, b) => b.total - a.total);
      },
      [],
    );
    return {
      overallPayment,
      overallWithdrawal,
      overallBalance,
      totalVendors,
      totalIndividualBuilders: totalIndividualBuilders,
      totalCorporateBuilders,
      contractComplete: contractComplete,
      contractInProgress: contractInProgress,
      paymentPerMonth,
      withdrawalPerMonth,
      overallRefund,
      overallBalancePerMonth,
      paymentPerWeek,
      withdrawalPerWeek,
      overallBalancePerWeek,
      overallRefundPerMonth,
      overallRefundPerWeek,
      isIndividualBuilderTrendPerMonth,
      isVendorTrendPerMonth,
      isCorporateBuilderTrendPerMonth,
      totalOrders,
      ongoingOrders,
      completedOrders,
      topCat,
    };
  }
}
