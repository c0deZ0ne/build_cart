import { ApiProperty } from '@nestjs/swagger';

export class DocsResponseDto {
  @ApiProperty({ description: 'User ID', example: '123456789' })
  userId: string;

  @ApiProperty({ description: 'Certificate of Location URL', example: 'https://example.com/certificate-location.pdf' })
  certificateOfLocation: string;

  @ApiProperty({ description: 'Certificate of Incorporation URL', example: 'https://example.com/certificate-incorporation.pdf' })
  certificateOfIncorporation: string;

  @ApiProperty({ description: 'Utility Bill URL', example: 'https://example.com/utility-bill.pdf' })
  UtilityBill: string;

  @ApiProperty({ description: 'Business Contact Signature URL', example: 'https://example.com/business-contact-signature.png' })
  businessContactSignature: string;

  @ApiProperty({ description: 'ID Verification Status', example: 'Verified' })
  IdVerificationStatus: string;

  @ApiProperty({ description: 'Business Contact ID', example: '987654321' })
  businessContactId: string;

  @ApiProperty({ description: 'Other Documents URL', example: 'https://example.com/other-docs.pdf' })
  other_docs: string;
}
