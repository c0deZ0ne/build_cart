import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { BusinessSize } from 'src/modules/vendor/models/vendor.model';

export class UpdateFundManagerDto {
  @ApiProperty({ example: 'A1-234566' })
  @IsString({ message: 'business reg number should be a string' })
  @IsOptional()
  businessRegNo: string;

  @ApiProperty({ example: 'MICRO' })
  @IsString({ message: 'business size should be a string' })
  @IsOptional()
  businessSize: BusinessSize;

  @ApiProperty({ example: '2 waka street makurdi' })
  @IsString({ message: 'business address should be a string' })
  @IsOptional()
  businessAddress: string;
}
