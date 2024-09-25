import { ApiProperty } from '@nestjs/swagger';

export class BusinessInfoResponseDto {
  @ApiProperty({ description: 'User ID', example: '123456789' })
  userId: string;

  @ApiProperty({ description: 'Business Address', example: '123 Main Street, Cityville' })
  Business_Address: string;

  @ApiProperty({ description: 'Business Registration Number', example: 'ABC123XYZ' })
  business_registration_no: string;

  @ApiProperty({ description: 'Business Size', example: 'Medium' })
  business_size: string;
}
