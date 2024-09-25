import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEmail,
  IsDefined,
  IsUUID,
} from 'class-validator';

export class CreateInvitationDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ example: 'Splenzert Technology' })
  buyerName?: string | null;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ example: 'Splenzert Technology' })
  fundManagerName?: string | null;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  @IsDefined()
  @ApiProperty({ example: 'fundManagermail@splenzert.com' })
  buyerEmail: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6 ' })
  FundManagerId: string | null;
}
