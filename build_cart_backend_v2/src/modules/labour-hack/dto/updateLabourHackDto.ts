import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { SPECIFICATION } from '../models/labour-hack.model';

export class UpdateLabourHackDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ example: 'Test Labour' })
  name: string;

  @IsEnum(SPECIFICATION)
  @IsOptional()
  @ApiProperty({ enum: SPECIFICATION, example: SPECIFICATION.DOMESTIC })
  specification: SPECIFICATION;
}
