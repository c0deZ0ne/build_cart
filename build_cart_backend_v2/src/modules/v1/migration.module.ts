import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MigrationService } from './migration.service';
import { User } from '../user/models/user.model';
import { Vendor } from '../vendor/models/vendor.model';
import { Contract } from '../contract/models';
import { Documents } from '../documents/models/documents.model';
import { Project } from '../project/models/project.model';
import {
  RfqItem,
  RfqQuote,
  RfqQuoteMaterial,
  RfqRequest,
  RfqRequestMaterial,
} from '../rfq/models';
import { Ticket } from '../ticket/models/ticket.model';
import {
  V1User,
  V1Company,
  V1Individual,
  V1Team,
  V1RfqProject,
  V1Ticket,
  V1RfqNameOption,
  V1RfqCategory,
  V1RfqRequest,
  V1RfqMaterial,
  V1RfqMeasurementNameOption,
  V1RfqQuote,
  V1RfqQuoteMaterial,
  V1Contract,
  V1Documents,
  V1Country,
  V1State,
  V1Bank,
} from './model';
import { MigrationController } from './migration.controller';
import { Bank } from '../bank/models/bank.model';
import { Builder } from '../builder/models/builder.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Vendor,
      Builder,
      RfqItem,
      RfqQuote,
      RfqQuoteMaterial,
      RfqRequest,
      RfqRequestMaterial,
      Contract,
      Documents,
      Ticket,
      Project,
      Bank,
    ]),
    SequelizeModule.forFeature(
      [
        V1User,
        V1Company,
        V1Individual,
        V1Team,
        V1RfqProject,
        V1Ticket,
        V1RfqNameOption,
        V1RfqCategory,
        V1RfqRequest,
        V1RfqMaterial,
        V1RfqMeasurementNameOption,
        V1RfqQuote,
        V1RfqQuoteMaterial,
        V1Contract,
        V1Documents,
        V1Country,
        V1State,
        V1Bank,
      ],
      'v1',
    ),
  ],
  providers: [MigrationService],
  controllers: [MigrationController],
})
export class MigrationModule {}
