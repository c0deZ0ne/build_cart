import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CreateMyPaymentDto {
  @IsNotEmpty()
  @IsString()
  @IsDefined()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6 ' })
  BuilderId: string;

  @IsNotEmpty()
  @IsString()
  @IsDefined()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6 ' })
  ContractId: string;

  @IsNotEmpty()
  @IsString()
  @IsDefined()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6 ' })
  VendorId: string;

  @IsNotEmpty()
  @IsString()
  @IsDefined()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6 ' })
  PaymentId: string;
}
