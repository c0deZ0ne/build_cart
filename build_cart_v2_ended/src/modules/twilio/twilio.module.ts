import { Module } from '@nestjs/common';
import { TwilioService } from './twilio.service';

@Module({
  providers: [TwilioService],
  controllers: [],
  exports: [TwilioService],
})
export class TwilioModule {}
