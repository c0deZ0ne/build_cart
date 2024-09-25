import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class GetEarningsDto {
  @IsOptional()
  @IsDateString()
  @ApiProperty({ example: '2023-05-01' })
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ example: '2023-05-01' })
  endDate?: Date;
}
