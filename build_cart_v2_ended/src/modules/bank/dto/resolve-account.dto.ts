import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, Length } from 'class-validator';

export class ResolveAccountDto {
  @IsNumberString()
  @IsNotEmpty()
  @Length(10)
  @ApiProperty({ example: '0022728151' })
  accountNumber: string;

  @IsNumberString()
  @IsNotEmpty()
  @ApiProperty({ example: '063' })
  bankCode: string;
}
