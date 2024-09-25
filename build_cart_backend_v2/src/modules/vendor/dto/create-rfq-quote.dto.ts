import {
  IsBoolean,
  IsDateString,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RfqQuoteMaterialDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ example: '6d0493bd-0d15-40d6-931b-6036f18474e1' })
  rfqRequestMaterialId: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 1000 })
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 50 })
  quantity: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Concrete' })
  description: string;
}

export class CreateRfqQuoteDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ example: '6d0493bd-0d15-40d6-931b-6036f18474e1' })
  rfqRequestId: string;

  @IsBoolean()
  @IsDefined()
  @ApiProperty({ example: true })
  canBargain: boolean;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ example: '2023-05-01' })
  deliveryDate: Date;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 10 })
  tax: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 1000 })
  logisticCost: number;

  @IsOptional()
  @IsUrl()
  @ApiProperty({ example: 'https://cloudinary.com' })
  lpo?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Dangote cement not available but Adenuga cement is what we have',
  })
  additionalNote?: string | null;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => RfqQuoteMaterialDto)
  @ApiProperty({ type: [RfqQuoteMaterialDto] })
  materials: RfqQuoteMaterialDto[];
}

export class DispatchDto {
  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ example: '2023-05-01' })
  startDeliveryDate: Date;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ example: '2023-05-01' })
  endDeliveryDate: Date;
}
