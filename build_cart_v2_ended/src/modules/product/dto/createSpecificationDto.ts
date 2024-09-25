import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSpecificationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '0.16mm' })
  value: string;
}
