import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsString, Length } from 'class-validator';

export class CreateBankAccountDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Praise Praise' })
  accountName: string;

  @IsNumberString()
  @IsNotEmpty()
  @Length(10)
  @ApiProperty({ example: '0022728151' })
  accountNumber: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'First Bank' })
  bankName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '063' })
  bankCode: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'FBN' })
  bankSlug: string;
}
