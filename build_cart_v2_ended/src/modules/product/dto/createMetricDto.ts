import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMetricDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Test Metric' })
  name: string;
}
