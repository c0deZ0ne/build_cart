import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport:
          config.get('NODE_ENV') == 'production'
            ? {
                host: config.get('MAIL_HOST'),
                secure: true,
                rejectUnauthorized: false,
                auth: {
                  user: config.get('MAIL_USER'),
                  pass: config.get('MAIL_PASSWORD'),
                },
              }
            : {
                host: config.get('DEV_MAIL_HOST'),
                secure: false,
                port: parseInt(config.get('DEV_MAIL_PORT')),
                rejectUnauthorized: false,
                auth: {
                  user: config.get('DEV_MAIL_USER'),
                  pass: config.get('DEV_MAIL_PASSWORD'),
                },
              },
        defaults: {
          from: `"No Reply" <${config.get('MAIL_FROM')}>`,
        },
        preview: true,
        template: {
          dir: path.join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService, EmailService],
  exports: [EmailService, EmailService],
})
export class EmailModule {}
