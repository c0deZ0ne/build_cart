import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdatePriceListDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ example: '6d0493bd-0d15-40d6-931b-6036f18474e1' })
  id: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Lafarge Cement',
  })
  label: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 3000 })
  price: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'bag',
  })
  metric: string;
}
