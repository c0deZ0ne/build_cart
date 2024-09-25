import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.string().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
      }),
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: +configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        autoLoadModels: true,
        synchronize: false,
        models: [],
        define: {
          timestamps: true,
        },
        logging: false,
        pool: {
          max: 20,
          min: 0,
          idle: 10000, // max time in ms that a connection can be idle before being released
          acquire: 60000, // max time in ms that Pool will try to get connection before throwing error
          evict: 1000, // max time in ms after which sequelize will remove idle connections
        }, // todo: add to config
      }),
      inject: [ConfigService],
    }),
    SequelizeModule.forRootAsync({
      name: 'v1',
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('V1_POSTGRES_HOST'),
        port: +configService.get('V1_POSTGRES_PORT'),
        username: configService.get('V1_POSTGRES_USER'),
        password: configService.get('V1_POSTGRES_PASSWORD'),
        database: configService.get('V1_POSTGRES_DB'),
        autoLoadModels: true,
        synchronize: false,
        models: [],
        define: {
          timestamps: false,
        },
        logging: false,
        pool: {
          max: 20,
          min: 0,
          idle: 10000,
          acquire: 60000,
          evict: 1000,
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
