import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { RfqRequestPaymentTerm, RfqRequestType } from 'src/modules/rfq/models';

export class RfqRequestMaterialDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ example: 'Cement' })
  itemName: string;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ example: '6d0493bd-0d15-40d6-931b-6036f18474e1' })
  rfqCategoryId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Dangote Cement' })
  description: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Blocmaster (50kg)' })
  specification: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Bags' })
  metric: string;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @ApiProperty({ example: 50 })
  @MaxLength(10)
  quantity: number;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 0 })
  @ApiProperty({ example: 1000 })
  @MaxLength(10)
  budget: number;
}

export class CreateRfqRequestDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Request for quotation for construction materials' })
  title: string;

  @IsBoolean()
  @ApiProperty({ example: true })
  canRecieveQuotes: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ example: false })
  budgetVisibility: boolean;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ example: '2023-05-01' })
  deliveryDate: Date;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '5B Adewale Kolawole Crescent, Lekki - Lagos' })
  deliveryAddress: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '+234812345670', required: false })
  deliveryContactNumber: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Delivery instructions go here' })
  deliveryInstructions?: string;

  @IsNotEmpty()
  @IsEnum(RfqRequestType)
  @ApiProperty({ enum: RfqRequestType })
  requestType: RfqRequestType;

  @IsNotEmpty()
  @IsEnum(RfqRequestPaymentTerm)
  @IsOptional()
  @ApiProperty({ enum: RfqRequestPaymentTerm })
  paymentTerns: RfqRequestPaymentTerm;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ example: true })
  tax: boolean;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 5 })
  taxPercentage?: number | null;

  @IsOptional()
  @IsUrl()
  @ApiProperty({ example: 'https://cloudinary.com' })
  lpo?: string | null;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ example: '8f2d2e11-9129-44e1-a6f8-6cecf25b3e3b' })
  projectId: string;

  @IsNotEmpty()
  @ApiProperty({
    type: 'array',
    name: 'deliverySchedule',
    items: { type: 'object' },
    example: [
      {
        dueDate: '2023-05-01',
        quantity: 20,
        description: 'some description',
      },
      {
        dueDate: '2023-05-05',
        quantity: 30,
        description: 'some description',
      },
    ],
  })
  deliverySchedule: Array<{
    dueDate: Date;
    quantity: number;
    description: string;
  }>;

  @ValidateNested({ each: true })
  @ApiProperty({ type: [RfqRequestMaterialDto] })
  materials: RfqRequestMaterialDto[];
}

export class RfqRequestDeliveryScheduleDto {
  @IsNotEmpty()
  @ApiProperty({
    type: 'array',
    name: 'deliverySchedule',
    items: { type: 'object' },
    example: [
      {
        dueDate: '2023-05-01',
        quantity: 20,
        description: 'some description',
      },
      {
        dueDate: '2023-05-05',
        quantity: 30,
        description: 'some description',
      },
    ],
  })
  deliverySchedule: Array<{
    dueDate: Date;
    quantity: number;
    description: string;
  }>;
}
