import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { BankService } from './bank.service';
import { BankController } from './bank.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Bank } from './models/bank.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PAYSTACK_SECRET: Joi.string().required(),
      }),
    }),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: 'https://api.paystack.co/',
        headers: {
          Authorization: 'Bearer ' + configService.get('PAYSTACK_SECRET'),
        },
        timeout: 7000,
      }),
      inject: [ConfigService],
    }),
    SequelizeModule.forFeature([Bank]),
  ],
  controllers: [BankController],
  providers: [BankService],
  exports: [BankService],
})
export class BankModule {}
