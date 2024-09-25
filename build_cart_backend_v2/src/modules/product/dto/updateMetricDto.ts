import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateMetricDto {
  @IsString()
  @ApiProperty({ example: 'testing 123' })
  name: string;
}
