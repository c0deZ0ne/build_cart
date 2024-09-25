import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../user/models/user.model';
import { Project, ProjectStatus } from '../project/models/project.model';
import { Transaction } from 'sequelize';
import { TeamMember } from '../rbac/models/user-teammembers.model';
import { Team } from '../rbac/models/team.model';
import { UserProject } from '../fund-manager/models/shared-project.model';
import { CreateUserProjectDto } from '../fund-manager/dto/user-project.dto';
import { Contract, ContractStatus } from '../contract/models';
import { RfqQuote, RfqRequest } from '../rfq/models';
import { OrderService } from '../order/order.services';
import { ProjectDto } from '../project/dto/create-project.dto';
import { ProjectService } from '../project/project.service';
import { Sequelize } from 'sequelize-typescript';
import { FundManager } from '../fund-manager/models/fundManager.model';
import { BuilderProject } from '../builder-project/model/builderProject.model';
import {
  ProjectTender,
  TenderStatus,
} from '../fund-manager/models/project-tender.model';
@Injectable()
export class BuilderProjectTenderService {
  constructor(
    @InjectModel(ProjectTender)
    private readonly projectTenderModel: typeof ProjectTender,
  ) {}
  async getTender() {
    return await this.projectTenderModel.findAll({
      where: { status: TenderStatus.ONGOING },
    });
  }
}
