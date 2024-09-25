import { Injectable } from '@nestjs/common';
import { twilioClient } from './twilio';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TwilioService {
  constructor(private readonly configService: ConfigService) {}
  async sendOtp(phoneNumber: string, otp: number): Promise<void> {
    try {
      await twilioClient.messages.create({
        body: `Your OTP code is ${otp}`,
        from: this.configService.get('TWILIO_PHONE_NUMBER'),
        to: phoneNumber,
      });
    } catch (error) {
      return;
    }
  }
}
