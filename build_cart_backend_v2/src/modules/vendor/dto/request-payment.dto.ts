import { Optional } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsOptional } from 'class-validator';

export class RequestPayment {
  @ApiProperty({ example: 23456.45 })
  @IsDefined()
  Amount: number;

  @ApiProperty({
    example: 'request for payout for contract completed transaction(s)',
  })
  @Optional()
  description?: string | null;

  @IsOptional()
  @ApiPropertyOptional({
    example: [
      'https://www.upload.com/upload.png',
      'https://www.upload.com/upload.png',
    ],
  })
  proof_docs: string[];
}
