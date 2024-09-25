import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  isEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {  SystemPaymentPurpose } from '../../types';


export class ProjectPaymentDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6' })
  pay_ref: string | null;

  @IsDefined()
  @IsEnum(SystemPaymentPurpose, { message: 'Invalid payment type' })
  @IsNotEmpty()
  @ApiProperty({
    example: SystemPaymentPurpose.FUND_ORDER,
    enum: SystemPaymentPurpose,
    description: 'FUND_ORDER',
  })
  paymentPurpose:SystemPaymentPurpose

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6' })
  orderId: string | null;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6' })
  projectId: string | null;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ example: 200022 })
  pay_amount_collected?: number;
}
