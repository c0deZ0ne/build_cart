import { ApiProperty } from "@nestjs/swagger";

export class RecoveryResponseDto {
    @ApiProperty({ description: 'Customer Name', example: 'John Doe' })
    customerName: string;
  
    @ApiProperty({ description: 'Logo URL', example: 'https://example.com/logo.png' })
    logo: string;
  
    @ApiProperty({ description: 'Customer Type', example: 'Business' })
    customerType: string;
  
    @ApiProperty({ description: 'Phone Number', example: '+1234567890' })
    phoneNumber: string;
  
    @ApiProperty({ description: 'Signup Date', example: '2022-01-01' })
    signupDate: Date;
  
    @ApiProperty({ description: 'ID Verification Status', example: 'Verified' })
    IdVerificationStatus: string;
  
    @ApiProperty({ description: 'User ID', example: '123456789' })
    userId: string;
  
    @ApiProperty({ description: 'Recovery Request Type', example: 'account email reset' })
    recovery_request_type: string;
  }