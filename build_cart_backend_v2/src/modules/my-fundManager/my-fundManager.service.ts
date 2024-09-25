import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MyFundManager } from './models/myFundManager.model';
import { Builder } from '../builder/models/builder.model';
import { TransactionType } from '../project-wallet-transaction/models/project-transaction.model';
import { SharedProject } from '../shared-project/models/shared-project.model';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { FundManager } from '../fund-manager/models/fundManager.model';
import { Project } from '../project/models/project.model';
import { User } from '../user/models/user.model';
export type SponsorCustomers = {
  id: string;
  name: string;
  logo: string;
  totalSpent: number;
  balance: number;
  totalCredited: number;
  projects: any;
  createdAt: Date;
  address: string;
};
@Injectable()
export class MyFundManagerService {
  constructor(
    @InjectModel(MyFundManager)
    private readonly mySponsorModel: typeof MyFundManager,
    private readonly sequelise: Sequelize,
  ) {}

  /**
   * Adds a FundManager to the current builder's list of my Sponsors.
   * @param builderId The ID of the current builder.
   * @param FundManagerId The ID of the FundManager to add to my Sponsors.
   * @throws if FundManager already added to list.
   */
  async addSponsorToMyFundManagers(
    BuilderId: string,
    FundManagerId: string,
    ProjectId: string,
  ): Promise<void> {
    const mySponsor = await this.mySponsorModel.findOne({
      where: {
        BuilderId,
        ProjectId,
        FundManagerId,
      },
    });

    if (mySponsor) {
      throw new BadRequestException(`FundManager already added`);
    }

    await this.mySponsorModel.create({
      BuilderId,
      FundManagerId,
      ProjectId,
    });
  }

  /**
   * Retrieves all FundManager that belong to the current builder's list of my FundManager.
   * @param builderId The ID of the current builder.
   * @returns A list of FundManager that belong to my FundManager.
   */
  async getMyFundManagers(builderId: string): Promise<FundManager[]> {
    const mySponsor = await this.mySponsorModel.findAll({
      where: {
        BuilderId: builderId,
      },
      include: [
        {
          model: FundManager,
        },
      ],
    });

    return mySponsor.map((mySponsor) => mySponsor.FundManager);
  }

  /**
   * Retrieves all FundManager that belong to the current builder's list of my FundManager.
   * @param builderId The ID of the current builder.
   * @returns A list of FundManager that belong to my FundManager.
   */
  async getMyProjectFundManagers(builderId: string, ProjectId: string) {
    const mySponsor = await this.mySponsorModel.findAll({
      where: {
        BuilderId: builderId,
        ProjectId,
      },
      include: {
        all: true,
      },
    });
    return mySponsor;
  }

  /**
   * Retrieves all FundManager that belong to the current builder's list of my FundManager.
   * @param builderId The ID of the current builder.
   * @returns A list of FundManager that belong to my FundManager.
   */
  async getMyBuilder(FundManagerId: string): Promise<Builder[]> {
    const mySponsor = await this.mySponsorModel.findAll({
      where: {
        FundManagerId,
      },
      include: [
        {
          model: Builder,
        },
      ],
    });

    return mySponsor.map((myBuilders) => myBuilders.Builder);
  }

  /**
   * Retrieves all FundManager that belong to the current builder's list of my FundManager.
   * @param builderId  The ID of the current builder.
   * @param  FundManagerId the ID of the current  FundManagerId,
   * @param ProjectId  The ID of the current Project.
   * @returns A  MYSponsor that belong to my FundManager.
   */
  async getAssocBuilderFundManagerProjectDetails({
    FundManagerId,
    ProjectId,
  }: {
    FundManagerId: string;
    ProjectId: string;
  }): Promise<MyFundManager> {
    const mySponsorProjectData = await this.mySponsorModel.findOne({
      where: {
        FundManagerId,
        ProjectId,
      },
      include: [
        {
          model: Builder,
          attributes: ['name', 'email', 'logo', 'address'],
        },
        { model: Project },
      ],
    });

    return mySponsorProjectData;
  }
  async mySponsorProjectTransactionUpdate(
    userType: TransactionType,
    amount: GLfloat,
    _sharedProject: SharedProject,
    transaction: Transaction,
  ) {
    const mySponsoreHistory = await this.mySponsorModel.findOne({
      where: {
        FundManagerId: _sharedProject.FundManagerId,
        BuilderId: _sharedProject.BuilderId,
        ProjectId: _sharedProject.ProjectId,
      },
    });
    if (!mySponsoreHistory)
      throw new BadRequestException(
        'project not shared with this fundManager or not accepted yet',
      );
    if (userType === TransactionType.DEPOSIT) {
      const currentbalance = Number(mySponsoreHistory.balance);
      const updated = Number(currentbalance) + Number(amount);
      mySponsoreHistory.balance = updated;
      const currentTotalCredited = Number(mySponsoreHistory.totalCredited);
      const creditUpdated = Number(currentTotalCredited) + Number(amount);
      mySponsoreHistory.totalCredited = creditUpdated;
      await mySponsoreHistory.save({ transaction });
    }
    if (userType === TransactionType.WITHDRAWAL) {
      const current = Number(mySponsoreHistory?.totalSpent);
      const updated = Number(current) + Number(amount);
      mySponsoreHistory.totalSpent = updated;
      const currentBalance = Number(mySponsoreHistory?.balance);
      const updatedBalance = Number(currentBalance) - Number(amount);
      mySponsoreHistory.balance = updatedBalance;
      await mySponsoreHistory.save({ transaction });
    }
  }

 
}
