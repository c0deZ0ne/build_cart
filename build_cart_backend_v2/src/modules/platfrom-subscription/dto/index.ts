import { IsEnum, IsNotEmpty, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionStatus, SubscriptionType } from '../types';
import { PaymentProvider } from 'src/modules/payment/types';

export class CreateSubscriptionDto {
  @ApiProperty({ description: 'User ID', example: '1234567890' })
  @IsNotEmpty()
  userId: string;
}
export class PremiumSubscription {
  @ApiProperty({ description: 'User ID', example: '1234567890' })
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'pay_ref', example: '1234567890' })
  @IsNotEmpty()
  pay_ref: string;

  @ApiProperty({description: 'Payment provider' ,example:`${PaymentProvider.REMITA} or ${PaymentProvider.PAYSTACK}`})
  @IsEnum(PaymentProvider)
  PaymentProvide: PaymentProvider;
}

export class UpdateSubscriptionDto {
  @ApiProperty({ enum: SubscriptionType, description: 'Type of subscription' })
  @IsEnum(SubscriptionType)
  type?: SubscriptionType;

  @ApiProperty({ enum: SubscriptionStatus, description: 'Status of the subscription' })
  @IsEnum(SubscriptionStatus)
  status?: SubscriptionStatus;

  @ApiProperty({ description: 'Flag indicating whether the trial period has been used' })
  @IsBoolean()
  usedTrialPeriod?: boolean;

  @ApiProperty({ description: 'Date when the subscription will expire', example: '2024-12-31' })
  @IsNotEmpty()
  expirationDate?: Date;
}
