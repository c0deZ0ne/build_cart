import {
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsDefined,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BusinessSize } from 'src/modules/vendor/models/vendor.model';
import { randomUUID } from 'crypto';

export class NewFundManager {
  @ApiProperty({ example: randomUUID() })
  @IsDefined()
  UserId: string;

  @ApiProperty({ example: '123 Main St, City vile' })
  @IsOptional()
  @IsNotEmpty()
  businessAddress?: string | null;

  @ApiProperty({ enum: BusinessSize, example: 'LARGE', required: false })
  @IsOptional()
  @IsEnum(BusinessSize)
  businessSize: BusinessSize;

  @ApiProperty({ example: '123-456-789', required: false })
  @IsOptional()
  businessRegNo: string;

  @ApiProperty({ example: 'company_logo.png', required: false })
  @IsOptional()
  logo: string;

  @ApiProperty({ example: 'We FundManager dreams!', required: false })
  @IsOptional()
  about: string;
}

export class updateFundManagerDto extends NewFundManager {
  @ApiProperty({ example: 'CertificateOfLocation.pdf', required: false })
  @IsOptional()
  certificateOfLocation: string;

  @ApiProperty({ example: 'BankStatement.pdf', required: false })
  @IsOptional()
  BankStatement: string;

  @ApiProperty({ example: 'UtilityBill.pdf', required: false })
  @IsOptional()
  UtilityBill: string;
}

export class AdminUpdatedFundManager extends NewFundManager {
  @ApiProperty({ example: '123-456-789', required: false })
  @IsOptional()
  businessRegNo: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isBusinessVerified: boolean;
}
