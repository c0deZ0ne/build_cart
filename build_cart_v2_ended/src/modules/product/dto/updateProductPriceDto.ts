import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UpdateProductPriceDto {
  @IsString()
  @ApiProperty({ example: '474a6048-99f4-4048-8fb2-194b5ab2cd67' })
  specificationID: string;

  @IsNumber()
  @ApiProperty({ example: 1200 })
  price: number;
}
