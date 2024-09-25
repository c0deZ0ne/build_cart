import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class GetOverviewDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    example: 7,
    description: 'total amount of days you want to fetch by',
  })
  dateFilter?: number;
}
