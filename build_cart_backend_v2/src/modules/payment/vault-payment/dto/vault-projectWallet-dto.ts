import {
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEmail,
  IsObject,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class initializePaymentDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6' })
  userId?: string | null;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ example: 'jdsodsmdk-ndjie233 ' })
  reference?: string | null;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 5000 })
  amount: number;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'joshua@abc.com' })
  email: string;
}
