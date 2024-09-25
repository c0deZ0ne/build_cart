import {
  IsString,
  IsNumber,
  IsDate,
  ValidateNested,
  IsArray,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { RfqRequestPaymentTerm } from 'src/modules/rfq/models';
import { randomUUID } from 'crypto';

export class VendorBidDto {
  @ApiProperty()
  @IsString()
  quoteId: string;

  @ApiProperty()
  @IsString()
  vendorName: string;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsDate()
  deliveryDate: Date;
}

export class RFQMaterialDetailsDto {
  @ApiProperty({ example: 'rfq title' })
  @IsString()
  title: string;

  @ApiProperty({ example: randomUUID() })
  @IsString()
  id: string;

  @ApiProperty({ example: 'Cement' })
  @IsString()
  category: string;

  @ApiProperty()
  @IsNumber()
  budget: number;

  @ApiProperty({ example: new Date() })
  @IsString()
  deliveryAddress: string;

  @ApiProperty()
  @IsDate()
  estimatedDeliveryDate: Date;

  @ApiProperty()
  @IsNumber()
  ongoing: number;

  @ApiProperty()
  @IsNumber()
  completed: number;

  @ApiProperty()
  @IsEnum(RfqRequestPaymentTerm)
  paymentType: RfqRequestPaymentTerm;

  @ApiProperty({ type: [VendorBidDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VendorBidDto)
  bids: VendorBidDto[];
}
