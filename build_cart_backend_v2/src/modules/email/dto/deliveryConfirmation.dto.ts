import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { randomUUID } from 'crypto';

export class DeliveryConfirmationDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'poor communication' })
  vendorName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: `Defected wood.` })
  buyerName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'poor communication' })
  constructionMaterial: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'poor communication' })
  buyerEmail: string;

  @ApiProperty()
  @IsOptional()
  orderNumber: number;

  @IsNotEmpty()
  deliveryDate: Date;
}
