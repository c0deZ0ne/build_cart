import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateSpecificationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Testing Specs' })
  value: string;
}
