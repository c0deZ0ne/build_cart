import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateDisputeDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Defect' })
  reason: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiProperty({ example: `Defected wood.` })
  message: string;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  @ApiProperty({
    example: [`https://picsum.photos/200/300`, `https://picsum.photos/200/300`],
  })
  proofs?: string[];
}
