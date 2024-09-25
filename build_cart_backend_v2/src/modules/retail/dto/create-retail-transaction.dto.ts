import {
  IsArray,
  IsObject,
  ValidateNested,
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsEmail,
  MinDate,
  IsNotEmpty,
  IsDate,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import {
  DURATION_UNIT,
  TRANSACTION_TYPE,
} from '../models/retail-transaction.model';

export class ProductDto {
  @ApiProperty({ example: 'Cement' })
  @IsString()
  item_description: string;

  @ApiProperty({ example: 15000 })
  @IsNumber()
  @IsOptional()
  budget: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: '1ef8bfe8-f5b6-4e78-b088-08fc43aac34f' })
  @IsString()
  @IsOptional()
  productSpecificationProductID: string;

  @ApiProperty({ example: '1ef8bfe8-f5b6-4e78-b088-08fc43aac34f' })
  @IsString()
  @IsOptional()
  vendorProductSpecificationProductID: string;

  // @ApiProperty({ example: 'product' })
  // @IsString()
  // type: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Testing' })
  description: string;

  @ApiProperty({ example: TRANSACTION_TYPE.PRODUCT })
  @IsString()
  transaction_type: TRANSACTION_TYPE;

  @ApiProperty({ example: '0.16mm' })
  @IsString()
  specification: string;

  @ApiProperty({ example: 'Nos' })
  @IsString()
  quantity_unit: string;
}

export class ServiceDto {
  @ApiProperty({ example: 'DSTV Technician' })
  @IsString()
  item_description: string;

  @ApiProperty({ example: 30000 })
  @IsNumber()
  budget: number;

  @ApiProperty({ example: 'Commercial' })
  @IsString()
  specification: string;

  @ApiProperty({ example: 5 })
  @IsNumber()
  duration: number;

  @IsNumber()
  @ApiProperty({ example: 10 })
  quantity: number;

  @ApiProperty({ example: '2f34ff1c-2d20-4950-9c68-3405f421388f' })
  @IsString()
  labourHackID: string;

  @ApiProperty({ example: TRANSACTION_TYPE.SERVICE })
  @IsString()
  transaction_type: TRANSACTION_TYPE;

  @ApiProperty({ example: DURATION_UNIT.DAYS })
  @IsString()
  duration_unit: DURATION_UNIT;

  @ApiProperty({ example: 'tt' })
  @IsString()
  description: string;
}

export class UserDetailsDto {
  @ApiProperty({ example: 'imeh.usoro@cutstruct.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '256 Chapman Road STE 105-4' })
  @IsString()
  delivery_address: string;

}

export class CreateRetailTransactionDto {
  @ApiProperty({ type: [ProductDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products: ProductDto[];

  @ApiProperty({ type: [ServiceDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceDto)
  services: ServiceDto[];

  @ApiProperty({ type: UserDetailsDto })
  @IsObject()
  @ValidateNested()
  @Type(() => UserDetailsDto)
  retail_user_details: UserDetailsDto;
}
