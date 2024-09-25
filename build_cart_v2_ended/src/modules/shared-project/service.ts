// import {
//   BadRequestException,
//   Injectable,
//   NotFoundException,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { InjectModel } from '@nestjs/sequelize';
// import {
//   SharedProject,
//   SharedProjectStatus,
// } from './models/shared-project.model';
// import { CreateSharedProjectDto } from './dto/create.shared-project.dto';
// import { UserService } from '../user/user.service';
// import { User } from '../user/models/user.model';
// import { AcceptSharedProjectDto } from './dto/accept-shared-project.dto';
// import { DeclineSharedProjectDto } from './dto/decline-shared-project.dto';
// import { Project } from '../project/models/project.model';
// import { Op, Transaction } from 'sequelize';
// import { Builder } from '../builder/models/builder.model';
// import { FundManager } from '../fund-manager/models/fundManager.model';
// import { InvitationService } from '../invitation/invitation.service';
// import { MyProject } from '../my-project/models/myProjects.model';
// import { MyFundManager } from '../my-fundManager/models/myFundManager.model';
// import { Sequelize } from 'sequelize-typescript';
// @Injectable()
// export class SharedProjectService {
//   constructor(
//     @InjectModel(SharedProject)
//     private readonly sharedProjectModel: typeof SharedProject,
//     @InjectModel(MyProject)
//     private readonly myProjectModel: typeof MyProject,
//     @InjectModel(MyFundManager)
//     private readonly mySponsortModel: typeof MyFundManager,
//     private readonly invitationService: InvitationService,
//     private readonly userService: UserService,
//     private readonly sequelise: Sequelize,
//   ) {}

//   async create(
//     data: Partial<CreateSharedProjectDto>,
//     user: User,
//   ): Promise<SharedProject> {
//     const shareWith = await this.userService.getUserByEmail(data.email);
//     const sharedProjectExist = await this.sharedProjectModel.findOne({
//       where: { ProjectId: data.ProjectId },
//       include: [{ model: Project }],
//     });

//     if (
//       sharedProjectExist &&
//       sharedProjectExist.Project.CreatedById !== user.id
//     ) {
//       throw new BadRequestException(
//         'You are not the owner of this Project. Please contact support.',
//       );
//     }

//     if (!shareWith) {
//       if (user.FundManagerId) {
//         await this.invitationService.createInvitation(
//           {
//             buyerEmail: data.email,
//             fundManagerName: user.name,
//             FundManagerId: user.FundManagerId,
//           },
//           user,
//         );
//         data.status = SharedProjectStatus.ACCEPTED;
//         data.CreatedById = user.id;
//         data.FundManagerId = user.FundManagerId || shareWith.FundManagerId;
//         data.fundManagerEmail = user.email;
//         data.buyerEmail = data.buyerEmail;
//         data.BuilderId = null;
//       } else {
//         throw new BadRequestException(
//           "You can't share a project with an unregistered customer. Please contact support for assistance",
//         );
//       }
//     } else if (shareWith.id === user.id) {
//       throw new BadRequestException('You cannot share a project with yourself');
//     } else {
//       const existingSharedProject = await this.sharedProjectModel.findOne({
//         where: { email: data.email, ProjectId: data.ProjectId },
//       });

//       if (existingSharedProject) {
//         throw new BadRequestException(
//           'You are already sharing this project with this email',
//         );
//       }

//       data.CreatedById = user.id;
//       data.FundManagerId = user.FundManagerId || shareWith.FundManagerId;
//       data.BuilderId = user.BuilderId ? user.BuilderId : shareWith.BuilderId;
//       data.buyerEmail = shareWith.Builder ? shareWith.Builder.email : null;
//       data.status = user.FundManagerId
//         ? SharedProjectStatus.ACCEPTED
//         : SharedProjectStatus.PENDING;
//     }

//     const newSharedData = await this.sharedProjectModel.create(data);
//     await this.myProjectModel.create({
//       UserId: user.id,
//       SharedProjectId: newSharedData.id,
//     });

//     if (user.FundManagerId) {
//       const [mySponsoredShared] = await this.mySponsortModel.findOrCreate({
//         where: {
//           BuilderId: newSharedData.BuilderId,
//           FundManagerId: newSharedData.FundManagerId,
//           ProjectId: newSharedData.ProjectId,
//         },
//       });
//       await mySponsoredShared.$add('sharedProject', newSharedData);
//     }
//     return newSharedData;
//   }

//   async updateSharedProjects(
//     id: string,
//     data: Partial<SharedProject>,
//   ): Promise<SharedProject> {
//     const sharedProject = await this.sharedProjectModel.findByPk(id);
//     if (!sharedProject) {
//       throw new NotFoundException('Shared project not found');
//     }

//     sharedProject.set(data);
//     await sharedProject.save();

//     return sharedProject;
//   }

//   async deleteSharedProjectById(id: string, user: User): Promise<void> {
//     const sharedProject = await this.sharedProjectModel.findByPk(id);

//     if (!sharedProject) {
//       throw new NotFoundException('Shared project not found');
//     }

//     if (sharedProject.CreatedById !== user.id) {
//       throw new UnauthorizedException(
//         'You are not the owner of this shared project',
//       );
//     }
//     await sharedProject.destroy();
//   }

//   async findSharedProjectById(id: string): Promise<SharedProject> {
//     const sharedProject = await this.sharedProjectModel.findByPk(id);

//     if (!sharedProject) {
//       throw new NotFoundException('Shared project not found');
//     }

//     return sharedProject;
//   }

//   async getSharedProjectsForUser(email: string) {
//     return await this.sharedProjectModel.findAndCountAll({
//       where: {
//         email,
//         status: SharedProjectStatus.PENDING,

//         CreatedById: {
//           [Op.not]: null,
//         },
//       },
//       include: [
//         { model: Project, include: [Builder, FundManager] },
//         {
//           model: User,
//           as: 'CreatedBy',
//           attributes: { exclude: ['password'] },
//         },

//         {
//           model: FundManager,
//         },
//         {
//           model: Builder,
//         },
//       ],
//     });
//   }

//   // async getaceptedProject(email: string) {
//   //   return await this.sharedProjectModel.findAndCountAll({
//   //     where: {
//   //       email,
//   //       status: SharedProjectStatus.ACCEPTED,

//   //       CreatedById: {
//   //         [Op.not]: null,
//   //       },
//   //     },
//   //     include: [
//   //       { model: Project, include: [Builder, FundManager] },
//   //       {
//   //         model: User,
//   //         as: 'CreatedBy',
//   //         attributes: { exclude: ['password'] },
//   //       },
//   //       { model: User, as: 'Users' },

//   //       {
//   //         model: FundManager,
//   //       },
//   //       {
//   //         model: Builder,
//   //       },
//   //     ],
//   //   });
//   // }

//   // async getaceptedProjectByFundManagerId(FundManagerId: string) {
//   //   return await this.sharedProjectModel.findAndCountAll({
//   //     where: {
//   //       FundManagerId,
//   //       status: SharedProjectStatus.ACCEPTED,

//   //       CreatedById: {
//   //         [Op.not]: null,
//   //       },
//   //     },
//   //     include: [
//   //       { model: Project, include: [Builder] },
//   //       { model: User, as: 'Users' },
//   //     ],
//   //   });
//   // }
//   // async getAcceptedProjectsForUser(email: string, user: User) {
//   //   const acceptProject = await this.sharedProjectModel.findAndCountAll({
//   //     where: {
//   //       BuilderId: user.BuilderId,
//   //       status: SharedProjectStatus.ACCEPTED,
//   //     },
//   //     include: [
//   //       { model: Project },
//   //       {
//   //         model: FundManager,
//   //       },
//   //       { model: User, as: 'Users' },
//   //     ],
//   //   });

//   //   const uniqueEmails = new Set();

//   //   const uniqueSponsors = acceptProject.rows.filter((item) => {
//   //     if (!uniqueEmails.has(item.email)) {
//   //       uniqueEmails.add(item.email);
//   //       return true;
//   //     }
//   //     return false;
//   //   });
//   //   return uniqueSponsors;
//   // }

//   // async getSharedProjectsForSponsor(email: string) {
//   //   return await this.sharedProjectModel.findAndCountAll({
//   //     where: {
//   //       email,
//   //       status: SharedProjectStatus.ACCEPTED,
//   //       CreatedById: {
//   //         [Op.not]: null,
//   //       },
//   //     },
//   //     include: [
//   //       { model: Project, include: [Builder, FundManager] },
//   //       {
//   //         model: User,
//   //         as: 'CreatedBy',
//   //         attributes: { exclude: ['password'] },
//   //       },

//   //       {
//   //         model: FundManager,
//   //       },
//   //       { model: User, as: 'Users' },
//   //       {
//   //         model: Builder,
//   //       },
//   //     ],
//   //   });
//   // }

//   // async getSharedProjectByIdByProjectId(projectId) {
//   //   return await SharedProject.findOne({
//   //     where: {
//   //       ProjectId: projectId,
//   //     },
//   //     include: [
//   //       {
//   //         model: Project,
//   //       },
//   //       {
//   //         model: User,
//   //         as: 'CreatedBy',
//   //         attributes: { exclude: ['password'] },
//   //       },
//   //       {
//   //         model: Builder,
//   //         as: 'Builder',
//   //       },
//   //       {
//   //         model: FundManager,
//   //         as: 'FundManager',
//   //       },
//   //     ],
//   //   });
//   // }

//   // async getAcceptedUsersBySharedProject(id: string) {
//   //   const sharedProject = await this.sharedProjectModel.findByPk(id);
//   //   if (!sharedProject) {
//   //     throw new NotFoundException('Shared project not found');
//   //   }
//   //   return sharedProject.Users;
//   // }

//   async getAcceptedUsersBySharedProjectByEmail(email: string) {
//     const sharedProject = await this.sharedProjectModel.findOne({
//       where: { email },
//       include: [Project, User, Builder, FundManager],
//     });
//     if (!sharedProject) {
//       throw new NotFoundException('Shared project not found');
//     }
//     return sharedProject.Users;
//   }

//   getAllAcceptedProjects(User: User) {
//     return this.sharedProjectModel.findAll({
//       where: {
//         email: User.email,
//         status: SharedProjectStatus.ACCEPTED,
//       },
//       include: [
//         {
//           model: Project,
//           include: [
//             {
//               model: Builder,
//             },
//             {
//               model: FundManager,
//             },
//           ],
//         },
//       ],
//     });
//   }

//   async acceptSharedProject({
//     sharedProjectId,
//     user,
//   }: AcceptSharedProjectDto): Promise<SharedProject> {
//     const sharedProject = await this.sharedProjectModel.findOne({
//       where: { id: sharedProjectId, email: user.email },
//     });

//     if (!sharedProject) {
//       throw new NotFoundException(
//         'Shared project not found or Project not shared with this email',
//       );
//     }

//     if (sharedProject.status === SharedProjectStatus.ACCEPTED) {
//       throw new BadRequestException('You already accepted this project');
//     }

//     const [mySponsorData] = await this.mySponsortModel.findOrCreate({
//       where: {
//         BuilderId: sharedProject.BuilderId,
//         FundManagerId: sharedProject.FundManagerId,
//         ProjectId: sharedProject.ProjectId,
//       },
//     });

//     await mySponsorData.$add('sharedProject', sharedProject);

//     return await sharedProject.update({ status: SharedProjectStatus.ACCEPTED });
//   }

//   async declineSharedProject({
//     data,
//     transaction,
//   }: {
//     data: DeclineSharedProjectDto;
//     transaction?: Transaction;
//   }) {
//     if (!transaction) {
//       transaction = await this.sequelise.transaction();
//     }
//     const sharedProject = await this.sharedProjectModel.findOne({
//       where: { id: data.sharedProjectId, email: data.user.email },
//     });
//     try {
//       if (!sharedProject) {
//         throw new NotFoundException('Shared project not found');
//       }
//       if (sharedProject.status === SharedProjectStatus.ACCEPTED) {
//         throw new BadRequestException('You already accepted this project');
//       }
//       await this.myProjectModel.destroy({
//         where: {
//           SharedProjectId: sharedProject.id,
//         },
//         transaction,
//       });
//       await sharedProject.destroy({ transaction: transaction });
//       transaction.commit();
//     } catch (error) {
//       transaction.rollback();
//       throw new BadRequestException('error rejection project');
//     }
//   }

//   async checkProjectSharesWithUser(projectId: string, user: User) {
//     const sharedProject = await this.sharedProjectModel.findOne({
//       where: { ProjectId: projectId, email: user.email },
//       include: [Project],
//     });
//     if (!sharedProject) {
//       return false;
//     }
//     return sharedProject.Project;
//   }

//   async getBuilderProjectCustomers(user: User) {
//     return await this.getAcceptedProjectsForUser(user.email, user);
//   }

//   async getBuilderFundManageredProjectsForUser(
//     fundManagerId: string,
//     user: User,
//   ) {
//     const acceptProject = await this.sharedProjectModel.findAndCountAll({
//       where: {
//         FundManagerId: fundManagerId,
//         BuilderId: user.BuilderId,
//         status: SharedProjectStatus.ACCEPTED,
//       },
//       include: [
//         { model: Project },
//         {
//           model: FundManager,
//         },
//       ],
//     });

//     return acceptProject;
//   }
// }
