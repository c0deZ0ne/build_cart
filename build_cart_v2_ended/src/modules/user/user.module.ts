import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Builder } from '../builder/models/builder.model';
import { Contract } from '../contract/models';
import { EmailModule } from '../email/email.module';
import { UserProject } from '../fund-manager/models/shared-project.model';
import { MyProject } from '../my-project/models/myProjects.model';
import { Order } from '../order/models';
import { ProjectMedia } from '../project-media/models/project-media.model';
import { ProjectTransaction } from '../project-wallet-transaction/models/project-transaction.model';
import { ProjectWallet } from '../project-wallet/models/project-wallet.model';
import { Project } from '../project/models/project.model';
import { Permission } from '../rbac/models/permission';
import { RolePermission } from '../rbac/models/role-permision.model';
import { Role } from '../rbac/models/role.model';
import { UserRole } from '../rbac/models/user-role.model';
import { RfqBargain, RfqRequestMaterial } from '../rfq/models';
import { SharedProject } from '../shared-project/models/shared-project.model';
import { ProjectTransactionUser } from '../shared-wallet-transaction/shared-transactions.model';
import { UserProjectWallet } from '../shared-wallet-transaction/shared-wallet.model';
import { TwilioModule } from '../twilio/twilio.module';
import { UserTransaction } from '../user-wallet-transaction/models/user-transaction.model';
import { UserWallet } from '../user-wallet/models/user-wallet.model';
import { UserWalletModule } from '../user-wallet/user-wallet.module';
import { User } from './models/user.model';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import * as Joi from 'joi';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Project,
      RfqRequestMaterial,
      RfqBargain,
      ProjectMedia,
      Order,
      Contract,
      UserProject,
      RolePermission,
      Permission,
      Role,
      UserRole,
      MyProject,
      SharedProject,
      UserWallet,
      UserTransaction,
      ProjectTransaction,
      ProjectWallet,
      ProjectTransactionUser,
      UserProjectWallet,
      Builder,
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.string().required(),
      }),
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION')}s`,
        },
      }),
      inject: [ConfigService],
    }),
    TwilioModule,
    EmailModule,
    UserWalletModule,
    JwtModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
